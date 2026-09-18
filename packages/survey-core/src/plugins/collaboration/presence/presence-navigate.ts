import { DomWindowHelper, PageModel, Question, SurveyModel } from "survey-core";
import { IPresencePeer } from "./presence-envelope";
import { IPresenceState, resolvePage } from "./presence-state";
import { SurveyPresenceScene } from "./survey-scene";

// How long to keep looking for the node after switching pages. A lazily rendered
// question appears a frame or two later, so a single lookup would miss it.
const SCROLL_POLL_MS = 600;

// Jumps the local survey to where a peer is: the page of the question they are
// focused on - or, lacking focus, the question their cursor is anchored to - and
// scrolls it into view.
//
// It deliberately does NOT call survey.focusQuestion: that would steal the local
// caret and, worse, broadcast OUR focus as if we had clicked there.
export function goToParticipant(
  survey: SurveyModel,
  scene: SurveyPresenceScene,
  peer: IPresencePeer | undefined
): void {
  if (!peer) return;
  const state = peer.state as IPresenceState;
  if (!state) return;

  const targetName = state.focus || (!!state.cur ? state.cur.n : null);
  const question = !!targetName ? survey.getQuestionByName(targetName) : null;

  const page = !!question
    ? (question.page as PageModel)
    : (state.page ? resolvePage(survey, state.page) : null);
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
    const node = scene.findQuestionNode(targetName as string);
    if (!!node) {
      node.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    if (Date.now() - started > SCROLL_POLL_MS) return;
    const win: any = DomWindowHelper.getWindow();
    if (!!win && typeof win.requestAnimationFrame === "function") win.requestAnimationFrame(tryScroll);
    else setTimeout(tryScroll, 16);
  };
  tryScroll();
}
