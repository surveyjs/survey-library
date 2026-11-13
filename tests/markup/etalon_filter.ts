import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [
    {
      // The Filter Control (#11890): the fast-mode chips of two choice fields after the presets'
      // chips, one preset active. No source, so the chips are measured against nothing: the
      // runners stub ResizeObserver and load no styles, every width is 0 and no chip is cut.
      name: "Test Filter question markup: fast-mode chips and an active preset",
      json: {
        elements: [
          {
            type: "filter",
            name: "name",
            titleLocation: "hidden",
            fields: [
              { name: "country", title: "Country", fieldType: "dropdown",
                choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }] },
              { name: "status", title: "Status", fieldType: "dropdown", choices: ["open", "closed"] }
            ],
            items: [
              { name: "german", title: "German", expression: "{country} = 'de'" },
              { name: "open", title: "Open", expression: "{status} = 'open'" }
            ],
            defaultItem: "german"
          }
        ]
      },
      removeIds: true,
      snapshot: "filter-chips-active-preset"
    },
  ]
);
