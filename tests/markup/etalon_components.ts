import { registerMarkupTests } from "./helper";
import { Question } from "survey-core";

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
    }
  ]);