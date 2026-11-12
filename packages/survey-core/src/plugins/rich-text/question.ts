import { property, QuestionCommentModel, QuestionFactory, RendererFactory, Serializer } from "survey-core";
import { richTextCss } from "./defaultCss";

export type RichTextToolbarMode = "none" | "onFocus" | "onSelection" | "static";

// A comment that edits and stores HTML. Registered only when the plugin is imported.
export class QuestionRichTextModel extends QuestionCommentModel {
  // "none": no toolbar, formatting via keyboard shortcuts only.
  // "onFocus": floating toolbar shown while the editor has focus.
  // "onSelection": floating toolbar shown only while text is selected.
  // "static": always visible, in the editor footer. This is the default.
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

Serializer.addClass(
  "richtext",
  [{
    name: "richTextToolbarMode",
    default: "static",
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
