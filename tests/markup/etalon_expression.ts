import { registerMarkupTest } from "./helper";

registerMarkupTest(
  {
    name: "Test Expression question markup",
    json: {
      elements: [
        {
          name: "name",
          type: "expression",
          expression: "123",
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "expression",
    removeIds: true,

  });