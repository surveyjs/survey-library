import { registerMarkupTests } from "./helper";
import { Question, Action, createDropdownActionModel } from "survey-core";

registerMarkupTests(
  [
    {
      name: "Test popup list",
      json: {
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      before: () => { Question["questionCounter"] = 100; },
      initSurvey: (survey) => {
        const dropdown = survey.getQuestionByName("name");
        dropdown["dropdownListModel"].listModel.renderElements = true;
      },
      getElement: () => {
        return document.querySelector(".sv-popup.sv-dropdown-popup .sv-popup__container") as HTMLElement;
      },
      snapshot: "list-component"
    }, {
      name: "Test popup list with subitems",
      json: {
        questions: [
          {
            "type": "text",
            "name": "q1",
            "title": "Question title"
          }
        ]
      },
      before: () => { Question["questionCounter"] = 100; },
      initSurvey: (survey) => {
        survey.onGetQuestionTitleActions.add((_, opt) => {
          const items = [new Action({ id: "1", title: "text1" }), new Action({ id: "2", title: "text2" })];
          const item = createDropdownActionModel(
            { title: "bottom", showTitle: true },
            {
              verticalPosition: "bottom", horizontalPosition: "center", items: items,
              onSelectionChanged: (item, ...params) => { }
            });
          items[1].setItems([{ id: "11", title: "text11" }, { id: "21", title: "text21" }], () => { });
          opt.titleActions = [item];
        });
      },
      getElement: () => {
        return document.querySelector(".sv-popup .sv-popup__container") as HTMLElement;
      },
      snapshot: "list-component-with-subitems"
    }, {
      name: "Test popup list with separator",
      json: {
        questions: [
          {
            "type": "text",
            "name": "q1",
            "title": "Question title"
          }
        ]
      },
      before: () => { Question["questionCounter"] = 100; },
      initSurvey: (survey) => {
        survey.onGetQuestionTitleActions.add((_, opt) => {
          const items = [new Action({ id: "1", title: "text1" }), new Action({ id: "2", title: "text2", needSeparator: true })];
          const item = createDropdownActionModel(
            { title: "bottom", showTitle: true },
            {
              verticalPosition: "bottom", horizontalPosition: "center", items: items,
              onSelectionChanged: (item, ...params) => { }
            });
          opt.titleActions = [item];
        });
      },
      getElement: () => {
        return document.querySelector(".sv-popup .sv-popup__container") as HTMLElement;
      },
      snapshot: "list-component-with-separator"
    }
  ]);
