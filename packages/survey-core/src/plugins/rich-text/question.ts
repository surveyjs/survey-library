import { property, QuestionCommentModel, QuestionFactory, RendererFactory, Serializer } from "survey-core";
import { richTextCss } from "./defaultCss";

export type RichTextToolbarMode = "none" | "onFocus" | "onSelection" | "static";

// A comment that edits and stores HTML. Registered only when the plugin is imported.
export class QuestionRichTextModel extends QuestionCommentModel {
  // "none": no toolbar, formatting via keyboard shortcuts only.
  // "onFocus": floating toolbar shown while the editor has focus.
  // "onSelection": floating toolbar shown only while text is selected.
  // "static": always visible, in the editor footer. This is the default.
  // A matrix cell defaults to "onSelection": the footer toolbar does not fit the row.
  @property() richTextToolbarMode: RichTextToolbarMode;

  public getType(): string {
    return "richtext";
  }
  // Comment theme classes (form box, input, grip). Rich-text names are added in updateCssClasses.
  protected getCssType(): string {
    return "comment";
  }
  public get resizeStyle(): "none" | "horizontal" | "vertical" | "both" {
    return this.renderedAllowResize ? "vertical" : "none";
  }
  // Ahead of the view-mode fallback, so display and read-only use the rich component too.
  // With no renderer registered, the comment textarea shows the stored value.
  public getComponentName(): string {
    const rich = RendererFactory.Instance.getRenderer("richtext", "default");
    if (rich !== "default") return rich;
    return "comment";
  }
  protected updateCssClasses(res: any, css: any): void {
    super.updateCssClasses(res, css);
    const grip = res.grip;
    for (const key in richTextCss) {
      if (key === "grip") continue;
      res[key] = richTextCss[key];
    }
    res.grip = grip ? grip + " " + richTextCss.grip : richTextCss.grip;
  }
}

// The column and its template question carry the cell default, so a matrix cell and the JSON
// of its column agree. A question in a matrix detail panel is not a cell and keeps "static".
function defaultRichTextToolbarMode(obj: any): RichTextToolbarMode {
  if (!obj) return "static";
  // The template exists before its column is attached to the matrix. isEditableTemplateElement
  // marks it then, so an explicit "static" is stored instead of matching a "static" default.
  if (obj.inMatrixMode || obj.isEditableTemplateElement) return "onSelection";
  if (isMatrixDropdownQuestion(obj.colOwner)) return "onSelection";
  return "static";
}
function isMatrixDropdownQuestion(question: any): boolean {
  return !!question && typeof question.getType === "function" && Serializer.isDescendantOf(question.getType(), "matrixdropdownbase");
}

Serializer.addClass(
  "richtext",
  [{
    name: "richTextToolbarMode",
    default: "static",
    defaultFunc: defaultRichTextToolbarMode,
    choices: ["none", "onFocus", "onSelection", "static"]
  }],
  function () {
    return new QuestionRichTextModel("");
  },
  "comment"
);

QuestionFactory.Instance.registerQuestion("richtext", (name) => {
  return new QuestionRichTextModel(name);
});
