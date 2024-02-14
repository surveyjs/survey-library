import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";

const template = require("./file-page.html");

export var SurveyFilePage: any;

ko.components.register("sv-file-page", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const _implementor = new ImplementorBase(params.model);
      return {
        dispose: () => {
          _implementor.dispose();
        },
        model: params.model
      };
    }
  },
  template: template,
});
