import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [
    {
      name: "Slider: Single Mode",
      json: {
        questions: [
          {
            name: "name",
            type: "slider",
            sliderType: "single",
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "slider-single-mode",
    },
    {
      name: "Slider: Default Value: Single Mode",
      json: {
        questions: [
          {
            name: "name",
            type: "slider",
            sliderType: "single",
            defaultValue: 50,
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "slider-default-value-single-mode",
    },
    {
      name: "Slider: Range Mode",
      json: {
        questions: [
          {
            name: "name",
            type: "slider",
            sliderType: "range",
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "slider-range-mode",
    },
    {
      name: "Slider: Default Value: Range Mode",
      json: {
        questions: [
          {
            name: "name",
            type: "slider",
            sliderType: "range",
            defaultValue: [30, 60],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "slider-default-value-range-mode",
    },
    {
      name: "Slider: Read-Only: Single Mode",
      json: {
        questions: [
          {
            name: "name",
            type: "slider",
            sliderType: "single",
            defaultValue: 50,
            readOnly: true,
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "slider-read-only-single-mode",
    },
    {
      name: "Slider: Read-Only: Range Mode",
      json: {
        questions: [
          {
            name: "name",
            type: "slider",
            sliderType: "range",
            defaultValue: [30, 60],
            readOnly: true,
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "slider-read-only-range-mode",
    },
    // {
    //   name: "Slider: Error State: Single Mode",
    //   json: {
    //     questions: [
    //       {
    //         name: "name",
    //         type: "slider",
    //         sliderType: "single",
    //         defaultValue: 50,
    //         isRequired: true,
    //         titleLocation: "hidden"
    //       }
    //     ]
    //   },
    //   initSurvey(survey) {
    //     survey.tryComplete();
    //   },
    //   snapshot: "slider-error-state-single-mode",
    // },
    // {
    //   name: "Slider: Error State: Range Mode",
    //   json: {
    //     questions: [
    //       {
    //         name: "name",
    //         type: "slider",
    //         sliderType: "range",
    //         defaultValue: [30, 60],
    //         isRequired: true,
    //         titleLocation: "hidden"
    //       }
    //     ]
    //   },
    //   initSurvey(survey) {
    //     survey.tryComplete();
    //   },
    //   snapshot: "slider-error-state-range-mode",
    // }
  ]
);
