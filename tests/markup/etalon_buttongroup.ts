import { DropdownListModel } from "survey-core";
import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [{
    name: "Test button group as dropdown",
    json: {
      questions: [
        {
          name: "name",
          type: "buttongroup",
          titleLocation: "hidden",
          renderAs: "dropdown",
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
        }
      ]
    },
    initSurvey: (survey) => {
      let q1 = survey.getQuestionByName("name");
      const dropdownListModel = new DropdownListModel(q1);
      q1["dropdownListModel"] = dropdownListModel;
      dropdownListModel["popupModel"].isVisible = true;
    },
    removeIds: true,
    snapshot: "button-group-as-dropdown",
  }]
);