import { StylesManager } from "../../src/stylesmanager";
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
    name: "Test Rating question min/max labels",
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    snapshot: "rating-as-dropdown",
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    snapshot: "rating-as-dropdown-readonly-with-value",
  }
  ]
);