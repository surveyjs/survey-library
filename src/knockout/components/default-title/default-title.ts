import * as ko from "knockout";
import { Question } from "../../../question";
import { RendererFactory } from "../../../rendererFactory";
import { Panel } from "../../kopage";

const template = require("./default-title.html");

export class DefaultTitleViewModel {
  constructor(public element: Question | Panel) {}

  getIconClass() {
    var element = this.element;
    var cssClasses = element.isPanel
      ? element.cssClasses.panel
      : element.cssClasses;
    return (
      cssClasses.icon +
      (!element.isCollapsed ? " " + cssClasses.iconExpanded : "")
    );
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
