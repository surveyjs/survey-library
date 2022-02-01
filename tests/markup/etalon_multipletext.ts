import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [
    {
      name: "Test mutlipletext question markup",
      json: {
        questions: [
          {
            type: "multipletext",
            name: "multipletext",
            title: "Multipletext",
            titleLocation: "hidden",
            colCount: 2,
            items: [
              {
                name: "item1",
                title: "Text 1"
              },
              {
                name: "item2",
                title: "Text 2"
              },
              {
                name: "item3",
                title: "Text 3"
              },
              {
                name: "item4",
                title: "Text 4"
              },
            ],
          },
        ]
      },
      snapshot: "multipletext",
    },
  ]
);

