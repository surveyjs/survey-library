import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [
    {
      name: "Test Survey navigation custom buttons",
      json: {
        questions: [
          {
            "type": "html",
            "name": "q1",
            "html": "<div></div>"
          }
        ]
      },
      event: "onAfterRenderSurvey",
      initSurvey: (survey) => {
        survey.navigationBar.setItems([]);
        survey.addNavigationItem({
          id: "custom-action",
          title: "Custom Action",
          tooltip: "Custom Tooltip"
        });
      },
      snapshot: "survey-navigation"
    }
  ]);