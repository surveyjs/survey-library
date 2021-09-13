import * as ko from "knockout";
import { RendererFactory, DefaultTitleModel, Question } from "survey-core";
import { Panel } from "../../kopage";

const template = require("./default-title.html");

export class DefaultTitleViewModel {
  constructor(public element: Question | Panel) {}

  getIconCss() {
    const cssClasses = this.element.isPanel ? this.element.cssClasses.panel : this.element.cssClasses;
    return DefaultTitleModel.getIconCss(cssClasses, this.element.isCollapsed);
  }
}

ko.components.register("sv-default-title", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return new DefaultTitleViewModel(params.element);
    },
  },
  template: template
});

RendererFactory.Instance.registerRenderer(
  "element",
  "default-title",
  "sv-default-title"
);
