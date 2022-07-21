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
    let items10: Array<Action> = [];
    for (let index = 0; index < 10; index++) {
      items10[index] = new Action({ id: index.toString(), title: "item" + index });
    }
    const list10PopupModel = new PopupModel("sv-list", { model: new ListModel(items10, (item) => { }, true) }, "bottom", "center", true);

    let items30: Array<Action> = [];
    for (let index = 0; index < 30; index++) {
      items30[index] = new Action({ id: index.toString(), title: "item" + index });
    }
    const list30PopupModel = new PopupModel("sv-list", { model: new ListModel(items30, (item) => { }, true) }, "bottom", "center", true);

    const itemPopupModel = new PopupModel("sv-action", {
      model:
        new Action({ id: "innerAction", title: "innerAction", action: () => { alert("innerAction") } })
    }, "bottom", "center", true
    );
    const itemModalPopupModel = new PopupModel("sv-action",
      { model: new Action({ id: "innerAction3", title: "innerAction3", action: () => { alert("innerAction3") } }) }, "bottom", "center", true, true
    );

    var actions = [
      new Action({
        title: "item1",
        iconName: 'icon-search',
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
        component: "sv-action-bar-item-dropdown",
        title: "List 30",
        iconName: 'icon-search',
        id: "31",
        showTitle: true,
        action: () => {
          list30PopupModel.toggleVisibility();
        },
        popupModel: list30PopupModel
      }),
      new Action({
        component: "sv-action-bar-item-dropdown",
        title: "List 10",
        id: "333",
        showTitle: true,
        action: () => {
          list10PopupModel.toggleVisibility();
        },
        popupModel: list10PopupModel
      }),
      // new Action({
      //   component: "sv-action-bar-item-dropdown",
      //   title: "Modal popup",
      //   id: "4",
      //   showTitle: true,
      //   action: () => {
      //     itemModalPopupModel.toggleVisibility();
      //   },
      //   popupModel: itemModalPopupModel
      // })
    ];

    return actions;
  }

  constructor() {
    StylesManager.applyTheme("defaultV2");
    this.model = new SurveyModel(json);
    (<any>window).survey = this.model;
  }

  ngOnInit() {
    this.actionBar.setItems(this.getActions());
  }
}
