import { DropdownListModel, settings } from "survey-core";
import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [{
    name: "Test Rating question integers",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          rateMax: 4,
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "rating-simple",
  },
  {
    name: "Test Rating question integers readonly",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          readOnly: "true",
          rateMax: 4,
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "rating-simple-readonly",
  },
  {
    name: "Test Rating question integers disabled",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          rateMax: 4,
          titleLocation: "hidden"
        }
      ]
    },
    initSurvey: (survey) => survey.setDesignMode(true),
    snapshot: "rating-simple-disabled",
  },
  {
    name: "Test Rating question min/max labels disabled",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          rateMax: 4,
          titleLocation: "hidden",
          minRateDescription: "min",
          maxRateDescription: "max"
        }
      ]
    },
    snapshot: "rating-min-max",
  },
  {
    name: "Test Rating question min/max items",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          rateMax: 4,
          displayRateDescriptionsAsExtremeItems: true,
          titleLocation: "hidden",
          minRateDescription: "min",
          maxRateDescription: "max"
        }
      ]
    },
    snapshot: "rating-min-max-items",
  },
  {
    name: "Test Rating question as dropdown",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          titleLocation: "hidden",
          renderAs: "dropdown",
          rateMax: 4,
        }
      ]
    },

    snapshot: "rating-as-dropdown",
  },
  {
    name: "Test Rating question as dropdown with description",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          titleLocation: "hidden",
          minRateDescription: "mimimi",
          maxRateDescription: "mamama",
          displayMode: "dropdown",
          rateValues: [
            1,
            2,
            3,
            4
          ]
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

    snapshot: "rating-as-dropdown-description",
  },
  {
    name: "Test Rating question as dropdown readonly",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          titleLocation: "hidden",
          readOnly: true,
          renderAs: "dropdown",
          rateMax: 4,
        }
      ]
    },

    snapshot: "rating-as-dropdown-readonly",
  },
  {
    name: "Test Rating question as dropdown readonly with value",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          readOnly: true,
          defaultValue: 3,
          title: "Question title",
          titleLocation: "hidden",
          renderAs: "dropdown",
          rateMax: 4,
        }
      ]
    },

    snapshot: "rating-as-dropdown-readonly-with-value",
  },
  {
    name: "Test Rating question as dropdown disabled with value",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          defaultValue: 3,
          title: "Question title",
          titleLocation: "hidden",
          renderAs: "dropdown",
          rateMax: 4,
        }
      ]
    },
    initSurvey: (survey) => survey.setDesignMode(true),
    snapshot: "rating-as-dropdown-disabled-with-value",
  },
  {
    name: "Test Rating question as dropdown with value focused",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          defaultValue: 3,
          title: "Question title",
          titleLocation: "hidden",
          renderAs: "dropdown",
          rateMax: 4,
        }
      ]
    },
    initSurvey: (survey) => {
      let q1 = survey.getQuestionByName("name");
      const dropdownListModel = new DropdownListModel(q1);
      q1["dropdownListModel"] = dropdownListModel;
      survey.focusFirstQuestionAutomatic = false;
      q1["dropdownListModel"].onFocus(null);
    },
    timeout: 300,
    removeIds: true,
    snapshot: "rating-as-dropdown-with-value-focused",
  },
  {
    name: "Test Rating question as wrappable items",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          titleLocation: "hidden",
          displayMode: "buttons",
          rateMax: 4,
        }
      ]
    },

    snapshot: "rating-as-wrappable"
  },
  {
    name: "Test Rating question as stars",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          titleLocation: "hidden",
          rateType: "stars",
          rateMax: 2,
        }
      ]
    },
    snapshot: "rating-stars",
  },
  {
    name: "Test Rating question as stars readonly",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          titleLocation: "hidden",
          readonly: "true",
          rateType: "stars",
          rateMax: 2,
        }
      ]
    },
    snapshot: "rating-stars-readonly",
  },
  {
    name: "Test Rating question as stars disabled",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          titleLocation: "hidden",
          rateType: "stars",
          rateMax: 2,
        }
      ]
    },
    snapshot: "rating-stars-disabled",
    initSurvey: (survey) => survey.setDesignMode(true),
  },
  {
    name: "Test Rating question as smileys",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          titleLocation: "hidden",
          rateType: "smileys",
          rateMax: 2,
        }
      ]
    },
    snapshot: "rating-smileys",
  },
  {
    name: "Test Rating question as smileys readonly",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          titleLocation: "hidden",
          readOnly: true,
          rateType: "smileys",
          rateMax: 2,
        }
      ]
    },
    snapshot: "rating-smileys-readonly",
  },
  {
    name: "Test Rating question as smileys disabled",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          titleLocation: "hidden",
          rateType: "smileys",
          rateMax: 2,
        }
      ]
    },
    initSurvey: (survey) => survey.setDesignMode(true),
    snapshot: "rating-smileys-disabled",
  },
  {
    name: "Test Rating question display mode",
    json: {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          titleLocation: "hidden",
          displayMode: "buttons",
          rateMax: 4,
        }
      ]
    },
    initSurvey: survey => {
      survey.mode = "display";
    },
    snapshot: "rating-display-mode",
  }]
);
