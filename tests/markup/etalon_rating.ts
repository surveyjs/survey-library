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
  }
  ]
);