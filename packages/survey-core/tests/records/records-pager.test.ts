import { describe, test, expect } from "vitest";
import { ActionContainer } from "../../src/actions/container";
import { Base } from "../../src/base";
import { ILocalizableOwner } from "../../src/localizablestring";
import { createRecordsPagerActions, IRecordsPagerCssClasses, IRecordsPagerOwner, pagerEdgeMinPageCount } from "../../src/records/records-pager";

// A fake question: the state is in a property hash, so the pager's updaters observe it.
class FakeOwner extends Base implements IRecordsPagerOwner {
  public moves: Array<string> = [];
  constructor(pageIndex: number, pageCount: number) {
    super();
    this.setPropertyValue("pageIndex", pageIndex);
    this.setPropertyValue("pageCount", pageCount);
  }
  public get pageIndex(): number { return this.getPropertyValue("pageIndex"); }
  public get pageCount(): number { return this.getPropertyValue("pageCount"); }
  public get isCountKnown(): boolean { return this.getPropertyValue("isCountKnown", true); }
  public set isCountKnown(val: boolean) { this.setPropertyValue("isCountKnown", val); }
  public get isPageMovePending(): boolean { return this.getPropertyValue("isPageMovePending", false); }
  public get isDataLoading(): boolean { return this.getPropertyValue("isDataLoading", false); }
  public set isDataLoading(val: boolean) { this.setPropertyValue("isDataLoading", val); }
  public get canGoPrevPage(): boolean { return this.pageIndex > 0; }
  public get canGoNextPage(): boolean { return this.pageIndex < this.pageCount - 1; }
  public goToPage(pageIndex: number): void { this.moves.push("goTo(" + pageIndex + ")"); }
  public prevPage(): void { this.moves.push("prev"); }
  public nextPage(): void { this.moves.push("next"); }
  public getLocalizationFormatString(strName: string, ...args: any[]): string {
    return strName + (args.length > 0 ? "(" + args.join(",") + ")" : "");
  }
  public getLocOwner(): ILocalizableOwner { return null; }
  public getCssClasses(): IRecordsPagerCssClasses { return { pagerPage: "page-css", pagerTotal: "total-css" }; }
}

describe("The pager actions of a records question", () => {
  test("first, prev, the page dropdown, the total, next and last show what the owner answers", () => {
    const owner = new FakeOwner(1, pagerEdgeMinPageCount);
    const container = createRecordsPagerActions(new ActionContainer(), owner);
    const actions = container.actions;
    expect(actions.map(a => a.id), "#1").toEqual(["sv-pager-first", "sv-pager-prev", "sv-pager-page", "sv-pager-total", "sv-pager-next", "sv-pager-last"]);
    expect(actions.map(a => a.title), "#2").toEqual(["pageFirstText", "pagePrevText", "2", "pagerTotalText(10)", "pageNextText", "pageLastText"]);
    expect(actions.map(a => a.visible), "#3: ten pages show first and last").toEqual([true, true, true, true, true, true]);
    expect(actions.map(a => a.enabled), "#4").toEqual([true, true, true, false, true, true]);
    expect(actions[2].ariaLabel, "#5").toBe("progressText(2,10)");
    expect([actions[2].innerCss, actions[3].innerCss], "#6").toEqual(["page-css", "total-css"]);
    expect(actions[3].action, "#7: the total is not a button").toBeUndefined();
    [0, 1, 4, 5].forEach(index => actions[index].action());
    expect(owner.moves, "#8").toEqual(["goTo(0)", "prev", "next", "goTo(9)"]);
  });
  test("an unknown count: no total, no first and last, the dropdown's name without a total", () => {
    const owner = new FakeOwner(1, 12);
    owner.isCountKnown = false;
    const actions = createRecordsPagerActions(new ActionContainer(), owner).actions;
    expect(actions.filter(a => a.visible).map(a => a.id), "#1").toEqual(["sv-pager-prev", "sv-pager-page", "sv-pager-next"]);
    expect(actions[2].ariaLabel, "#2").toBe("progressbarPage(2)");
    owner.isCountKnown = true;
    expect(actions.filter(a => a.visible).length, "#3: the count settled").toBe(6);
    expect(actions[2].ariaLabel, "#4").toBe("progressText(2,12)");
  });
  test("nothing can be moved while a page is read", () => {
    const owner = new FakeOwner(1, 12);
    const actions = createRecordsPagerActions(new ActionContainer(), owner).actions;
    owner.isDataLoading = true;
    expect(actions.map(a => a.enabled), "#1").toEqual([false, false, false, false, false, false]);
    owner.isDataLoading = false;
    expect(actions.map(a => a.enabled), "#2").toEqual([true, true, true, false, true, true]);
  });
});
