import { DomDocumentHelper, EventBase, PageModel, Question, SurveyModel } from "survey-core";
import { IPresenceCursorPoint, IPresenceState, pageKey, roundFraction } from "./presence-state";
import { SurveyPresenceScene } from "./survey-scene";

// Mouse moves are sampled on a trailing edge of this window.
export const MOUSE_THROTTLE_MS = 50;
// At most this many samples per packet: enough for the receiver spline to
// reproduce the curve without inflating the frame.
export const CURSOR_MAX_POINTS = 3;
// How long after a focusout before the focus is reported as cleared. Moving between
// two inputs fires focusout before focusin, and without this the ring would blink.
export const BLUR_DEBOUNCE_MS = 300;

// Captures the local participant's presence: which page they are on, which question
// their caret is in, and where their mouse is.
//
// It emits the FULL state every time rather than a diff, so any single frame fully
// re-establishes this participant for anyone who receives it. `retain` separates the
// durable half (page, focus - stored by the relay and replayed to late joiners) from
// the ephemeral one (the cursor, which may be dropped under congestion).
export class PresenceCapture {
  public onStateChanged: EventBase<PresenceCapture, { retain: boolean }> =
    new EventBase<PresenceCapture, { retain: boolean }>();

  private focus: string | null = null;
  private page: string | null = null;
  private cursor: IPresenceState["cur"] = null;

  private blurTimer: any;
  private mouseTimer: any;
  private pendingEvent: MouseEvent | null = null;
  private pendingSamples: Array<{ x: number, y: number, time: number }> = [];
  private disposed = false;
  private detachHandlers: Array<() => void> = [];

  constructor(private survey: SurveyModel, private scene: SurveyPresenceScene) {
    const onFocusInQuestion = (_sender: SurveyModel, options: { question: Question }) => {
      // Climb to the top-level question: matrix cells and composite parts render
      // nested [data-name] roots whose names are not unique across the survey.
      let question: any = options.question;
      while(!!question && !!question.parentQuestion) question = question.parentQuestion;
      const name = !!question && typeof question.name === "string" ? question.name : "";
      if (!name) return;
      this.cancelBlur();
      this.setFocus(name);
    };
    const onPageChanged = () => this.syncPage();
    survey.onFocusInQuestion.add(onFocusInQuestion);
    survey.onCurrentPageChanged.add(onPageChanged);
    this.detachHandlers.push(() => {
      survey.onFocusInQuestion.remove(onFocusInQuestion);
      survey.onCurrentPageChanged.remove(onPageChanged);
    });

    const doc = DomDocumentHelper.getDocument();
    if (!!doc) {
      const onFocusOut = () => this.scheduleBlur();
      const onFocusIn = (ev: FocusEvent) => {
        const target = ev.target as Element | null;
        if (!!target && !!target.closest && !!target.closest("[data-name]"))this.cancelBlur();
      };
      const onMouseMove = (ev: MouseEvent) => this.onMouseMove(ev);
      const onMouseLeave = () => this.setCursor(null);
      const onVisibility = () => {
        if (doc.visibilityState === "hidden")this.setCursor(null);
      };
      doc.addEventListener("focusout", onFocusOut, true);
      doc.addEventListener("focusin", onFocusIn, true);
      doc.addEventListener("mousemove", onMouseMove, true);
      doc.addEventListener("mouseleave", onMouseLeave);
      doc.addEventListener("visibilitychange", onVisibility);
      this.detachHandlers.push(() => {
        doc.removeEventListener("focusout", onFocusOut, true);
        doc.removeEventListener("focusin", onFocusIn, true);
        doc.removeEventListener("mousemove", onMouseMove, true);
        doc.removeEventListener("mouseleave", onMouseLeave);
        doc.removeEventListener("visibilitychange", onVisibility);
      });
    }

    // Announce the starting page at once, so the first frame this client sends is
    // already useful to everyone else.
    this.syncPage(true);
  }

  public getState(retain: boolean): IPresenceState {
    const state: IPresenceState = { page: this.page, focus: this.focus };
    if (!retain) state.cur = this.cursor ?? null;
    return state;
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.cancelBlur();
    if (this.mouseTimer !== undefined) clearTimeout(this.mouseTimer);
    this.detachHandlers.forEach((detach) => detach());
    this.detachHandlers = [];
  }

  private syncPage(silent: boolean = false): void {
    const current = this.survey.currentPage as PageModel;
    const key = !!current ? pageKey(this.survey, current) : null;
    if (key === this.page) return;
    this.page = key;
    if (!silent)this.fire(true);
  }

  private setFocus(name: string | null): void {
    if (name === this.focus) return;
    this.focus = name;
    this.fire(true);
  }

  private setCursor(cursor: IPresenceState["cur"]): void {
    this.cursor = cursor;
    this.fire(false);
  }

  private fire(retain: boolean): void {
    if (this.disposed) return;
    this.onStateChanged.fire(this, { retain });
  }

  private cancelBlur(): void {
    if (this.blurTimer === undefined) return;
    clearTimeout(this.blurTimer);
    this.blurTimer = undefined;
  }

  private scheduleBlur(): void {
    this.cancelBlur();
    this.blurTimer = setTimeout(() => {
      this.blurTimer = undefined;
      this.setFocus(null);
    }, BLUR_DEBOUNCE_MS);
  }

  private onMouseMove(ev: MouseEvent): void {
    this.pendingEvent = ev;
    this.pendingSamples.push({ x: ev.clientX, y: ev.clientY, time: Date.now() });
    if (this.mouseTimer !== undefined) return;
    this.mouseTimer = setTimeout(() => {
      this.mouseTimer = undefined;
      const event = this.pendingEvent;
      const samples = this.pendingSamples;
      this.pendingEvent = null;
      this.pendingSamples = [];
      if (!this.disposed && !!event && samples.length > 0)this.captureMouse(event, samples);
    }, MOUSE_THROTTLE_MS);
  }

  private captureMouse(ev: MouseEvent, samples: Array<{ x: number, y: number, time: number }>): void {
    const anchor = this.resolveAnchor(ev);
    if (!anchor) {
      // Nothing rendered to anchor to (a completion page, say) - hide the cursor.
      this.setCursor(null);
      return;
    }
    const rect = anchor.rect;
    // Downsample the window to first / middle / last.
    const picks = samples.length <= CURSOR_MAX_POINTS
      ? samples
      : [samples[0], samples[Math.floor((samples.length - 1) / 2)], samples[samples.length - 1]];
    const t0 = picks[0].time;
    const points: Array<IPresenceCursorPoint> = picks.map((s) => ({
      x: roundFraction((s.x - rect.left) / rect.width),
      y: roundFraction((s.y - rect.top) / rect.height),
      t: Math.max(0, Math.round(s.time - t0)),
    }));
    this.setCursor({ n: anchor.name, p: points });
  }

  // The outermost [data-name] ancestor of the pointer, or - when the pointer is not
  // over a question at all - the nearest rendered one, with the fractions allowed to
  // fall outside 0..1. That is what keeps a peer cursor visible in page gaps and
  // margins instead of vanishing the moment it leaves a question box.
  private resolveAnchor(ev: MouseEvent): { name: string, rect: DOMRect } | null {
    const target = ev.target as Element | null;
    let node: Element | null = !!target && !!target.closest ? target.closest("[data-name]") : null;
    if (!!node) {
      let parent = node.parentElement ? node.parentElement.closest("[data-name]") : null;
      while(!!parent) {
        node = parent;
        parent = node.parentElement ? node.parentElement.closest("[data-name]") : null;
      }
      const rect = node.getBoundingClientRect();
      const name = node.getAttribute("data-name");
      if (!!name && rect.width > 0 && rect.height > 0) return { name, rect };
    }
    let best = Infinity;
    let found: { name: string, rect: DOMRect } | null = null;
    this.scene.topLevelQuestionNodes().forEach((candidate) => {
      const rect = candidate.getBoundingClientRect();
      const name = candidate.getAttribute("data-name");
      if (!name || rect.width === 0 || rect.height === 0) return;
      const dx = Math.max(rect.left - ev.clientX, 0, ev.clientX - rect.right);
      const dy = Math.max(rect.top - ev.clientY, 0, ev.clientY - rect.bottom);
      const distance = dx * dx + dy * dy;
      if (distance >= best) return;
      best = distance;
      found = { name, rect };
    });
    return found;
  }
}
