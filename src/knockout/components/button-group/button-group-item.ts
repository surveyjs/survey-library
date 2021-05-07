import * as ko from "knockout";
import { ButtonGroupItemModel } from "survey-core";
const template = require("./button-group-item.html");

export class ButtonGroupItemViewModel {
  public constructor(public model: ButtonGroupItemModel) {}
}
ko.components.register("sv-button-group-item", {
  viewModel: {
    createViewModel: (params: any) => {
      const model = new ButtonGroupItemModel(
        params.question,
        params.item,
        params.index()
      );
      const viewModel = new ButtonGroupItemViewModel(model);
      return viewModel;
    },
  },
  template: template,
});
