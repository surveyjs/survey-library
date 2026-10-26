import { describe, test, expect } from "vitest";
import { PanelModel } from "../src/panel";
import { AnimationGroup, AnimationTab } from "../src/utils/animation";
import { IPanelDynamicAnimationOwner, PanelDynamicAnimation } from "../src/paneldynamic-animation";

// A panel as the animation sees it: an id, and its own animations it can block.
class FakePanel {
  public blocked = 0;
  public released = 0;
  constructor(public id: string) { }
  blockAnimations(): void { this.blocked++; }
  releaseAnimations(): void { this.released++; }
}
const panelOf = (id: string): PanelModel => <any>new FakePanel(id);
/* The dynamic panel as the animation reads it. Animations are not allowed, so a sync is applied at once,
   unless the test replaces it, and the rerender event is never asked for. */
class FakeQuestion {
  public isRenderModeList = false;
  public currentPanel: PanelModel;
  public currentIndex = -1;
  public cssClasses = { panelWrapperEnter: "enter", panelWrapperLeave: "leave" };
  public cssContent = "";
  public animationAllowed = false;
  public blocked = 0;
  public released = 0;
  getWrapperElement(): HTMLElement { return undefined; }
  blockAnimations(): void { this.blocked++; }
  releaseAnimations(): void { this.released++; }
}
class TestOwner implements IPanelDynamicAnimationOwner {
  public question: any = new FakeQuestion();
  public renderedPanels: Array<PanelModel> = [];
  public panels: Array<PanelModel> = [];
  public page: Array<PanelModel> = [];
  public disposed: Array<Array<PanelModel>> = [];
  getPanels(): Array<PanelModel> { return this.panels; }
  getPanelVisibleIndex(panel: PanelModel): number { return this.page.indexOf(panel); }
  disposeLeftPanels(rendered: Array<PanelModel>): void { this.disposed.push(rendered); }
}
function createAnimation(): { owner: TestOwner, animation: PanelDynamicAnimation } {
  const owner = new TestOwner();
  return { owner: owner, animation: new PanelDynamicAnimation(owner) };
}

describe("PanelDynamicAnimation: the rendered panels", () => {
  test("the first panels shown are not animated: the question blocks its animations around the sync", () => {
    const { owner, animation } = createAnimation();
    const first = panelOf("p1");
    animation.syncRenderedPanels([first]);
    expect(owner.renderedPanels, "#1").toEqual([first]);
    expect([owner.question.blocked, owner.question.released], "#2").toEqual([1, 1]);
    expect(owner.disposed, "#3: the animation ended").toEqual([[first]]);
  });
  test("a change of the shown panels runs the animation; the panels that left are disposed when it ends", () => {
    const { owner, animation } = createAnimation();
    const first = panelOf("p1");
    const second = panelOf("p2");
    owner.renderedPanels = [first];
    const sync = animation.panelsAnimation.sync.bind(animation.panelsAnimation);
    let running: Array<PanelModel>;
    animation.panelsAnimation.sync = (val: Array<PanelModel>): void => { running = val; };
    animation.syncRenderedPanels([second]);
    expect(owner.question.blocked, "#1: animated").toBe(0);
    expect(owner.disposed, "#2: still running").toEqual([]);
    animation.panelsAnimation.sync = sync;
    animation.panelsAnimation.sync(running);
    expect(owner.renderedPanels, "#3").toEqual([second]);
    expect(owner.disposed, "#4").toEqual([[second]]);
  });
  test("a list question animates as a group, a carousel as a tab; a reset follows the mode", () => {
    const { owner, animation } = createAnimation();
    const tab = animation.panelsAnimation;
    expect(tab instanceof AnimationTab, "#1").toBe(true);
    expect(animation.panelsAnimation, "#2: created once").toBe(tab);
    owner.question.isRenderModeList = true;
    animation.resetPanelsAnimation();
    expect(animation.panelsAnimation instanceof AnimationGroup, "#3").toBe(true);
  });
  test("the panels' own animations are blocked and released", () => {
    const { owner, animation } = createAnimation();
    const panels = [new FakePanel("p1"), new FakePanel("p2")];
    owner.panels = <any>panels;
    animation.disablePanelsAnimations();
    expect(panels.map(p => p.blocked), "#1").toEqual([1, 1]);
    animation.enablePanelsAnimations();
    expect(panels.map(p => p.released), "#2").toEqual([1, 1]);
  });
});

describe("PanelDynamicAnimation: the focus of a new panel", () => {
  test("without a running animation the new panel is focused at once, and once", () => {
    const { animation } = createAnimation();
    let focused = 0;
    animation.focusNewPanelWhenIdle(() => { focused++; });
    expect(focused, "#1").toBe(1);
    expect(animation.focusNewPanelCallback, "#2").toBeUndefined();
    animation.syncRenderedPanels([panelOf("p1")]);
    expect(focused, "#3: not again").toBe(1);
  });
  test("a running animation focuses the new panel when it ends", () => {
    const { owner, animation } = createAnimation();
    owner.renderedPanels = [panelOf("p1")];
    const sync = animation.panelsAnimation.sync.bind(animation.panelsAnimation);
    let running: Array<PanelModel>;
    animation.panelsAnimation.sync = (val: Array<PanelModel>): void => { running = val; };
    animation.syncRenderedPanels([panelOf("p2")]);
    let focused = 0;
    animation.focusNewPanelWhenIdle(() => { focused++; });
    expect(focused, "#1: waits for the animation").toBe(0);
    animation.panelsAnimation.sync = sync;
    animation.panelsAnimation.sync(running);
    expect(focused, "#2").toBe(1);
  });
});

describe("PanelDynamicAnimation: the direction of a carousel move", () => {
  const cssOf = (animation: PanelDynamicAnimation, panel: PanelModel): string => animation.getAnimationOptions().getEnterOptions(panel).cssClass;
  function createCarousel(): { owner: TestOwner, animation: PanelDynamicAnimation, panels: Array<PanelModel> } {
    const { owner, animation } = createAnimation();
    const panels = [panelOf("p0"), panelOf("p1"), panelOf("p2")];
    owner.page = panels;
    owner.question.currentPanel = panels[1];
    owner.question.currentIndex = 1;
    return { owner: owner, animation: animation, panels: panels };
  }
  test("a panel still on the page answers for its own position", () => {
    const { owner, animation, panels } = createCarousel();
    owner.renderedPanels = [panels[0], panels[1]];
    expect(cssOf(animation, panels[1]), "#1").toBe("enter sv-pd-animation-left");
    owner.renderedPanels = [panels[2], panels[1]];
    expect(cssOf(animation, panels[1]), "#2").toBe("enter sv-pd-animation-right");
  });
  test("a panel a page move took away leaves from the index the current panel replaced", () => {
    const { owner, animation, panels } = createCarousel();
    owner.renderedPanels = [panelOf("off-page"), panels[1]];
    animation.moveCurrentVisibleIndex(3);
    animation.moveCurrentVisibleIndex(1);
    expect(animation.leftVisibleIndex, "#1").toBe(3);
    expect(animation.currentVisibleIndex, "#2").toBe(1);
    expect(cssOf(animation, panels[1]), "#3").toBe("enter sv-pd-animation-right");
  });
  test("a removed panel leaves from its removed index", () => {
    const { owner, animation, panels } = createCarousel();
    const removed = panelOf("removed");
    owner.renderedPanels = [removed, panels[1]];
    animation.moveCurrentVisibleIndex(2);
    animation.removedPanel = removed;
    animation.removedPanelIndex = 0;
    expect(cssOf(animation, panels[1]), "#1").toBe("enter sv-pd-animation-removing sv-pd-animation-left");
    animation.removedPanelIndex = 2;
    expect(cssOf(animation, panels[1]), "#2").toBe("enter sv-pd-animation-removing sv-pd-animation-right");
  });
  test("an added panel is marked while its focus is pending; a list question has no direction", () => {
    const { owner, animation, panels } = createCarousel();
    owner.renderedPanels = [panels[0], panels[1]];
    animation.focusNewPanelCallback = () => { };
    expect(cssOf(animation, panels[1]), "#1").toBe("enter sv-pd-animation-adding sv-pd-animation-left");
    owner.question.isRenderModeList = true;
    expect(cssOf(animation, panels[1]), "#2").toBe("enter");
    expect(animation.getAnimationOptions().getLeaveOptions(panels[1]).cssClass, "#3").toBe("leave");
  });
});
