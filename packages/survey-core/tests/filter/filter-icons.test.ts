import { describe, test, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { createFilter } from "./filter-test-helpers";
import { QuestionFilterModel } from "../../src/question_filter";
import { PanelModel } from "../../src/panel";
import { Action } from "../../src/actions/action";

// An icon is drawn for the size it is shown at; one drawn for another size is scaled - blurred, its
// lines thicker or thinner than the set's. A small or larger action shows an icon at 24px
// (sd-action.scss), an x-small one at 16px; the chips row brings its actions' icons down to 16px
// (sd-filter.scss).
const presets = [
  { name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "smart", kind: "ai", expression: "{age} > 60" }];
function control(): QuestionFilterModel {
  return createFilter({ items: presets });
}
function iconsOf(q: QuestionFilterModel): { [id: string]: string } {
  q.toggleItem("adults");
  const res: { [id: string]: string } = {};
  const add = (a: Action): void => { res[a.id] = a.iconName; };
  add(q.clearToolbar.getActionById("sv-filter-clear"));
  add(q.chipsToolbar.getActionById("sv-filter-item-smart"));
  const modal = q.createFilterModal();
  add(modal.creationToolbar.getActionById("sv-filter-modal-add-preset"));
  add(modal.presetsTitleToolbar.getActionById("sv-filter-modal-edit-presets"));
  res["sv-filter-modal-item-smart"] = modal.presetsToolbar.getActionById("sv-filter-modal-item-smart").iconName;
  const edit = q.createEditPresetsDialog("adults");
  add(edit.actionsToolbar.getActionById("sv-filter-preset-delete"));
  add(edit.actionsToolbar.getActionById("sv-filter-preset-reset"));
  const created = q.createAddPresetDialog([{ field: "age", operator: "greater", value: 18 }]);
  const panel = <PanelModel>created.form.getPanelByName("contains");
  add(panel.footerActions.filter((a: Action): boolean => a.id === "sv-filter-preset-add-field")[0]);
  edit.dispose();
  created.dispose();
  modal.dispose();
  return res;
}

describe("Filter: the icons of its buttons", () => {
  test("every button shows an icon drawn for its size: 16px in the chips row and the pencil, 24px elsewhere", () => {
    expect(iconsOf(control())).toEqual({
      "sv-filter-clear": "icon-close-16x16",
      "sv-filter-item-smart": "icon-sparkle-16x16",
      "sv-filter-modal-add-preset": "icon-plus-24x24",
      "sv-filter-modal-edit-presets": "icon-edit-16x16",
      "sv-filter-modal-item-smart": "icon-sparkle-24x24",
      "sv-filter-preset-delete": "icon-delete-24x24",
      "sv-filter-preset-reset": "icon-reset-24x24",
      "sv-filter-preset-add-field": "icon-plus-24x24"
    });
  });
  test("each of them is in the v2 set and drawn on the canvas its name says", () => {
    const icons = iconsOf(control());
    Object.keys(icons).map((id: string): string => icons[id]).forEach((name: string): void => {
      const file = path.resolve(__dirname, "../../src/images-v2", name.substring("icon-".length) + ".svg");
      expect(fs.existsSync(file), name).toBe(true);
      const size = /-(\d+)x\d+$/.exec(name)[1];
      const svg = fs.readFileSync(file, "utf8");
      expect(new RegExp(`width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"`).test(svg), name).toBe(true);
    });
  });
  test("the pencil of the presets is an x-small muted action, as the mockup's title actions", () => {
    const modal = control().createFilterModal();
    const pencil = modal.presetsTitleToolbar.getActionById("sv-filter-modal-edit-presets");
    expect(Object.assign({}, pencil.predefinedAppearance, pencil.appearance))
      .toEqual({ style: "neutral", mode: "tertiary-muted", size: "x-small" });
    modal.dispose();
  });
});
