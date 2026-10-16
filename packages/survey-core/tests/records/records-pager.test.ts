import { describe, test, expect } from "vitest";
import { ActionContainer } from "../../src/actions/container";
import { createRecordsPagerActions, IRecordsPagerOwner } from "../../src/records/records-pager";

class FakePaging {
  public canGoPrevPage = false;
  public canGoNextPage = true;
  public isCountKnown = true;
  public moves: Array<string> = [];
  public prevPage(): boolean { this.moves.push("prev"); return true; }
  public nextPage(): boolean { this.moves.push("next"); return true; }
}
class FakeOwner implements IRecordsPagerOwner {
  public pageIndex = 1;
  public pageCount = 4;
  public getLocalizationFormatString(strName: string, ...args: any[]): string {
    return strName + (args.length > 0 ? "(" + args.join(",") + ")" : "");
  }
}

describe("The pager actions of a records question", () => {
  test("the previous button, the page info and the next button show what the paging answers", () => {
    const paging = new FakePaging();
    const owner = new FakeOwner();
    const container = createRecordsPagerActions(new ActionContainer(), <any>paging, owner);
    const actions = container.actions;
    expect(actions.map(a => a.id), "#1").toEqual(["sv-pager-prev", "sv-pager-info", "sv-pager-next"]);
    expect(actions.map(a => a.iconName), "#2").toEqual(["icon-arrowleft", undefined, "icon-arrowright"]);
    expect(actions[0].title, "#3").toBe("pagePrevText");
    expect(actions[2].title, "#4").toBe("pageNextText");
    expect(actions[0].showTitle, "#5").toBe(false);
    expect(actions[0].enabled, "#6").toBe(false);
    expect(actions[2].enabled, "#7").toBe(true);
    expect(actions[1].title, "#8: page 2 of 4").toBe("indexText(2,4)");
    expect(actions[1].enabled, "#9").toBe(false);
    expect(actions[1].disableTabStop, "#10").toBe(true);
    actions[0].action();
    actions[2].action();
    expect(paging.moves, "#11").toEqual(["prev", "next"]);
  });
  test("an unknown count shows the page number alone", () => {
    const paging = new FakePaging();
    paging.isCountKnown = false;
    const container = createRecordsPagerActions(new ActionContainer(), <any>paging, new FakeOwner());
    expect(container.actions[1].title, "#1").toBe("2");
  });
});
