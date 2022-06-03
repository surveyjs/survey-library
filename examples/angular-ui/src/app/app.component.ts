import { Component } from "@angular/core";
import { SurveyModel, StylesManager, ActionContainer, Action, PopupModel, ListModel } from "survey-core";

const json = require("../assets/survey.json");

StylesManager.applyTheme("defaultV2");

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "angular-ui";

  model: SurveyModel;
  // actionBar: ActionContainer;

  constructor() {
    this.model = new SurveyModel(json);
    (<any>window).survey = this.model;

    // this.actionBar = new ActionContainer();
  }
  /*ngOnInit() {
    let items = [];
    for (let index = 0; index < 10; index++) {
      items[index] = new Action({ title: "item" + index, id: index.toString() });
    }
    const itemPopupModel = new PopupModel("sv-action",
      new Action({ id: "innerAction", title: "innerAction", action: () => { alert("innerAction") } }), "bottom", "left", true
    );

    const itemModalPopupModel = new PopupModel("sv-action",
      new Action({ id: "innerAction", title: "innerAction", action: () => { alert("innerAction") } }), "bottom", "left", true, true
    );

    var actions = [
      new Action({
        title: "item1",
        id: "1",
        action: () => {
          alert("item1");
        },
      }),
      new Action({
        title: "item2",
        id: "2",
        action: () => {
          alert("item2");
        },
      }),
      new Action({
        component: "sv-action-bar-item-dropdown",
        title: "Dropdown",
        id: "3",
        showTitle: true,
        action: () => {
          itemPopupModel.toggleVisibility();
        },
        popupModel: itemPopupModel
      }),
      new Action({
        title: "Modal popup",
        id: "4",
        showTitle: true,
        action: () => {
          itemModalPopupModel.toggleVisibility();
        },
        popupModel: itemModalPopupModel
      })
    ];
    this.actionBar.setItems(actions);
  }*/
}
