import * as ko from "knockout";
import { CssClassBuilder } from "src/utils/cssClassBuilder";
import { Question } from "survey-core";
import { RendererFactory } from "survey-core";
import { Panel } from "../../kopage";

const template = require("./default-title.html");

export class DefaultTitleViewModel {
  constructor(public element: Question | Panel) {}

  getIconClass() {
    const cssClasses = this.element.isPanel ? this.element.cssClasses.panel : this.element.cssClasses;
    return new CssClassBuilder()
      .append(cssClasses.icon)
      .append(cssClasses.iconExpanded, !this.element.isCollapsed)
      .toString();
  }
}

ko.components.register("sv-default-title", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return new DefaultTitleViewModel(params.element);
    },
  },
  template: template,
});

RendererFactory.Instance.registerRenderer(
  "element",
  "default-title",
  "sv-default-title"
);
