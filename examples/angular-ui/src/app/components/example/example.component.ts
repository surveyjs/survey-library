import { Component } from "@angular/core";
import { SurveyModel, StylesManager, ActionContainer, Action, PopupModel, ListModel, settings } from "survey-core";
const json = require("../../../assets/survey.json");

@Component({
  selector: "example",
  templateUrl: "./example.component.html",
  styleUrls: ["./example.component.scss"]
})
export class ExampleComponent {
  title = "angular-ui";

  model: SurveyModel;

  private getActions() {
    const itemModalPopupModel = new PopupModel("sv-action",
      { model: new Action({ id: "innerAction3", title: "innerAction3", action: () => { alert("innerAction3") } }) }, "bottom", "center", true, true
    );

    var actions = [
      new Action({
        id: "fefe",
        component: "sv-action-bar-item",
        title: "Click",
        showTitle: true,
        action: () => {
          const model = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
          model.focusFirstQuestionAutomatic = false;
          const opt: any = {
            model: model,
            survey: model
          };
          settings.showModal("survey", opt, <any>undefined, undefined);
        }
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
}
