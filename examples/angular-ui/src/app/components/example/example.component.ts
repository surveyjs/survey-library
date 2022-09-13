import { Component } from "@angular/core";
import { SurveyModel, StylesManager, ActionContainer, Action, PopupModel, ListModel } from "survey-core";
const json = require("../../../assets/survey.json");

@Component({
  selector: "example",
  templateUrl: "./example.component.html",
  styleUrls: ["./example.component.scss"]
})
export class ExampleComponent {
  title = "angular-ui";

  model: SurveyModel;
  actionBar: ActionContainer;

  private getActions() {
    const itemModalPopupModel = new PopupModel("sv-action",
      { model: new Action({ id: "innerAction3", title: "innerAction3", action: () => { alert("innerAction3") } }) }, "bottom", "center", true, true
    );

    var actions = [
      new Action({
        component: "sv-action-bar-item-dropdown",
        title: "Modal popup",
        id: "4",
        showTitle: true,
        action: () => {
          itemModalPopupModel.toggleVisibility();
        },
        popupModel: itemModalPopupModel
      })
    ];

    return actions;
  }

  constructor() {
    StylesManager.applyTheme("defaultV2");
    this.model = new SurveyModel(json);
    this.model.onGetQuestionTitleActions.add((_, opt) => {
      opt.titleActions = this.getActions();
    });
    (<any>window).survey = this.model;
  }

  ngOnInit() {
    this.actionBar.setItems(this.getActions());
  }
}
