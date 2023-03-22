import { registerMarkupTests } from "./helper";

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
      initSurvey: (survey) => {
        const dropdown = survey.getQuestionByName("name");
        dropdown["dropdownListModel"].listModel.renderElements = true;
      },
      getElement: () => {
        return document.querySelector(".sv-popup.sv-dropdown-popup") as HTMLElement;
      },
      snapshot: "list-component"
    }
  ]);