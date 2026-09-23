import { DomWindowHelper, PageModel, Question, SurveyModel, getScrollBehavior } from "survey-core";
import { IPresencePeer } from "./presence-envelope";
import { IPresenceState, resolvePage } from "./presence-state";
import { SurveyPresenceScene } from "./survey-scene";

// How long to keep looking for the node after switching pages. A lazily rendered
// question appears a frame or two later, so a single lookup would miss it.
const SCROLL_POLL_MS = 600;

// Brings a question into view: switches to its page if needed, forces it to render
// under lazy rendering, and scrolls to it.
//
// It deliberately does NOT call survey.focusQuestion: that would steal the local
// caret and, worse, broadcast OUR focus as if we had clicked there. `fallbackPage`
// is the page to show when the question itself cannot be resolved.
export function scrollToQuestion(
  survey: SurveyModel,
  scene: SurveyPresenceScene,
  questionName: string | null,
  fallbackPage?: string | null
): void {
  const question = !!questionName ? survey.getQuestionByName(questionName) : null;

  const page = !!question
    ? (question.page as PageModel)
    : (fallbackPage ? resolvePage(survey, fallbackPage) : null);
  if (!!page && survey.currentPage !== page) survey.currentPage = page;
  if (!question) return;

  // Under lazy rendering the question may not be in the DOM yet, and scrolling to
  // a node that does not exist is a silent no-op.
  const currentPage = survey.currentPage as any;
  if ((survey as any).isLazyRendering && !!currentPage && typeof currentPage.forceRenderElement === "function") {
    currentPage.forceRenderElement(question as Question);
  }

  const started = Date.now();
  const tryScroll = () => {
    const node = scene.findQuestionNode(questionName as string);
    if (!!node) {
      node.scrollIntoView({ block: "center", behavior: getScrollBehavior() });
      return;
    }
    if (Date.now() - started > SCROLL_POLL_MS) return;
    const win: any = DomWindowHelper.getWindow();
    if (!!win && typeof win.requestAnimationFrame === "function") win.requestAnimationFrame(tryScroll);
    else setTimeout(tryScroll, 16);
  };
  tryScroll();
}

// Jumps the local survey to where a peer is: the page of the question they are
// focused on - or, lacking focus, the question their cursor is anchored to.
export function goToParticipant(
  survey: SurveyModel,
  scene: SurveyPresenceScene,
  peer: IPresencePeer | undefined
): void {
  if (!peer) return;
  const state = peer.state as IPresenceState;
  if (!state) return;
  scrollToQuestion(survey, scene, state.focus || (!!state.cur ? state.cur.n : null), state.page);
}
