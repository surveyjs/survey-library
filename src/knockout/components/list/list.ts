import * as ko from "knockout";
import { Action, ListModel } from "survey-core";
import { ImplementorBase } from "../../kobase";
import { ActionContainerImplementor } from "../action-bar/action-bar";

const template = require("./list.html");

export * from "./list-item";

export var ListViewComponent: any;

ko.components.register("sv-list", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const model: ListModel = params.model;
      const _implementor: ImplementorBase = new ActionContainerImplementor(model);
      model.initListContainerHtmlElement(componentInfo.element);
      return {
        model: model,
        dispose: () => {
          _implementor.dispose();
          model.initListContainerHtmlElement(undefined as any);
        },
        afterItemRender: (_: any, action: Action) => {
          !!ko.tasks && ko.tasks.runEarly();
          model.onLastItemRended(action);
        }
      };
    },
  },
  template: template,
});
