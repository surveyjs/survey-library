import {
  frameworks,
  url_test,
  initSurvey
} from "../helper";
import { Selector, ClientFunction } from "testcafe";
const title = "Tooltip errors";

var json = {
  questions: [
    {
      type: "matrixdynamic",
      name: "matrixdynamic_question",
      columns: [
        {
          isRequired: true,
          name: "Column 1",
        },
      ],
      choices: [1],
      rowCount: 1,
    },
    {
      type: "paneldynamic",
      name: "paneldynamic",
      templateElements: [
        {
          type: "text",
          isRequired: true,
          name: "paneldynamic_question",
        },
      ],
      panelCount: 1,
    },
  ],
};

const applyTheme = ClientFunction((theme) => {
  window["Survey"].StylesManager.applyTheme(theme);
});

const themeName = "defaultV2";

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`
    .page`${url_test}${themeName}/${framework}.html`.beforeEach(async (t) => {
    await applyTheme(themeName);
    await initSurvey(framework, json);
    await t.resizeWindow(1000, 1000);
  });
  test("check errors tooltip", async (t) => {
    const focusBody = ClientFunction(() => { document.body.focus(); });
    const matrixCellSelector = Selector(
      ".sd-table__cell:not(.sd-table__cell--header)"
    );
    const questionInPanelSelector = Selector(
      ".sd-question__content .sd-question__content"
    );
    const tooltipClass = ".sd-question__erbox--tooltip";
    await t
      .click(Selector("input[value='Complete']"));
    await focusBody();
    const tooltipInPanel = questionInPanelSelector.find(tooltipClass);
    const tooltipInMatrix = matrixCellSelector.find(tooltipClass);
    await t.expect(tooltipInPanel.visible).notOk()
      .hover(questionInPanelSelector, { offsetX: 30, offsetY: 30 })
      .expect(tooltipInPanel.visible).ok()
      .expect(tooltipInPanel.getStyleProperty("left")).eql("199px")
      .expect(tooltipInPanel.getStyleProperty("top")).eql("612px")
      .hover(questionInPanelSelector, { offsetX: 40, offsetY: 40 })
      .expect(tooltipInPanel.getStyleProperty("left")).eql("209px")
      .expect(tooltipInPanel.getStyleProperty("top")).eql("622px")
      .hover(matrixCellSelector, { offsetX: 10, offsetY: 10 })
      .expect(tooltipInMatrix.visible).ok()
      .expect(tooltipInMatrix.getStyleProperty("left")).eql("179px")
      .expect(tooltipInMatrix.getStyleProperty("top")).eql("220px")
      .hover(matrixCellSelector, { offsetX: 20, offsetY: 20 })
      .expect(tooltipInMatrix.getStyleProperty("left")).eql("189px")
      .expect(tooltipInMatrix.getStyleProperty("top")).eql("230px");
  });
});
