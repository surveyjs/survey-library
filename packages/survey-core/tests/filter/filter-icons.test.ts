import { describe, test, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { createFilter } from "./filter-test-helpers";
import { QuestionFilterModel } from "../../src/question_filter";
import { PanelModel } from "../../src/panel";
import { Action } from "../../src/actions/action";

// The control's buttons are small or larger, and those give an icon 24px (sd-action.scss): a 16px
// drawing there is scaled up - blurred, its lines half as thick again. Every icon they show is a
// 24px one of the v2 set, drawn for that size.
const presets = [
  { name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "smart", type: "ai", expression: "{age} > 60" }];
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
  test("every button shows a 24px icon", () => {
    expect(iconsOf(control())).toEqual({
      "sv-filter-clear": "icon-close-24x24",
      "sv-filter-item-smart": "icon-sparkle-24x24",
      "sv-filter-modal-add-preset": "icon-plus-24x24",
      "sv-filter-modal-edit-presets": "icon-edit-24x24",
      "sv-filter-modal-item-smart": "icon-sparkle-24x24",
      "sv-filter-preset-delete": "icon-delete-24x24",
      "sv-filter-preset-reset": "icon-reset-24x24",
      "sv-filter-preset-add-field": "icon-plus-24x24"
    });
  });
  test("each of them is in the v2 set and drawn on a 24px canvas", () => {
    const icons = iconsOf(control());
    Object.keys(icons).map((id: string): string => icons[id]).forEach((name: string): void => {
      const file = path.resolve(__dirname, "../../src/images-v2", name.substring("icon-".length) + ".svg");
      expect(fs.existsSync(file), name).toBe(true);
      const svg = fs.readFileSync(file, "utf8");
      expect(/width="24" height="24" viewBox="0 0 24 24"/.test(svg), name).toBe(true);
    });
  });
});
