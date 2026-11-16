import { describe, test, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { createFilter } from "./filter-test-helpers";
import { QuestionFilterModel } from "../../src/question_filter";
import { Action } from "../../src/actions/action";
import { ActionContainer } from "../../src/actions/container";
import { FilterChip } from "../../src/filter/filter-toolbars";
import { settings } from "../../src/settings";

// An icon is drawn for the size it is shown at; one drawn for another size is scaled - blurred, its
// lines thicker or thinner than the set's. A small or larger action shows an icon at 24px
// (sd-action.scss), an x-small one at 16px; the chips row brings its actions' icons down to 16px
// (sd-filter.scss).
const presets = [{ name: "adults", title: "Adults", expression: "{age} > 18" }];
function control(): QuestionFilterModel {
  return createFilter({ items: presets });
}
function iconsOf(q: QuestionFilterModel): { [id: string]: string } {
  q.toggleItem("adults");
  const res: { [id: string]: string } = {};
  const add = (a: Action): void => { res[a.id] = a.iconName; };
  add(q.chipsToolbar.getActionById("sv-filter-filters"));
  add(q.clearToolbar.getActionById("sv-filter-clear"));
  const preset = <FilterChip>q.chipsToolbar.getActionById("sv-filter-preset");
  add(preset);
  add(preset.clearAction);
  const modal = q.createFilterModal();
  add(modal.presetsToolbar.getActionById("sv-filter-modal-add-preset"));
  add(modal.presetsToolbar.getActionById("sv-filter-modal-edit-preset"));
  // Delete is in the footer the dialog host gives Edit Preset.
  const saved = settings.showDialog;
  let host: any;
  settings.showDialog = (o: any): any => {
    host = { options: o, footerToolbar: new ActionContainer(), model: { hide: () => o.onHide() } };
    return host;
  };
  try {
    q.showPresetDialog(modal, true);
    add(host.footerToolbar.getActionById("sv-filter-preset-delete"));
    host.model.hide();
  } finally {
    settings.showDialog = saved;
  }
  modal.dispose();
  return res;
}

describe("Filter: the icons of its buttons", () => {
  test("every button shows an icon drawn for its size: 16px in the chips row and the pencil, 24px elsewhere", () => {
    expect(iconsOf(control())).toEqual({
      "sv-filter-filters": "icon-filter-16x16",
      "sv-filter-clear": "icon-close-16x16",
      "sv-filter-preset": "icon-star-16x16",
      "sv-filter-preset-clear": "icon-close-16x16",
      "sv-filter-modal-add-preset": "icon-plus-24x24",
      "sv-filter-modal-edit-preset": "icon-edit-24x24",
      "sv-filter-preset-delete": "icon-delete-24x24"
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
  // The set draws this icon as three sliders at 24px and as two at 16px: the mockup's Filters chip
  // shows the two.
  test("Filters shows the 24px icon next to the search box and the 16px one in the chips row", () => {
    const q = createFilter({ items: presets, showSearch: true });
    const filters = q.searchToolbar.getActionById("sv-filter-filters");
    expect(filters.iconName, "#1").toBe("icon-filter-24x24");
    q.showSearch = false;
    expect(q.chipsToolbar.getActionById("sv-filter-filters"), "#2: the same button").toBe(filters);
    expect(filters.iconName, "#3").toBe("icon-filter-16x16");
    q.showSearch = true;
    expect(filters.iconName, "#4").toBe("icon-filter-24x24");
  });
  test("Add New and Edit Selected are small secondary actions, as the presets' pills: 24px icons", () => {
    const modal = control().createFilterModal();
    ["sv-filter-modal-add-preset", "sv-filter-modal-edit-preset"].forEach((id: string): void => {
      const action = modal.presetsToolbar.getActionById(id);
      expect(Object.assign({}, action.predefinedAppearance, action.appearance), id)
        .toEqual({ style: "neutral", mode: "secondary", size: "small" });
    });
    modal.dispose();
  });
});
