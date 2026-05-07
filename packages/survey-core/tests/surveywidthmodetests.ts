import { SurveyModel } from "../src/survey";
import { QuestionRatingModel } from "../src/question_rating";

import { describe, test, expect } from "vitest";
describe("Survey", () => {
  test("Survey widthMode property for startWithNewLine questions", () => {
    var survey = new SurveyModel({
      pages: [
        {
          elements: [
            {
              type: "text",
              name: "name1",
            },
            {
              type: "text",
              name: "name2",
            },
            {
              type: "text",
              name: "name3",
            },
            {
              type: "text",
              name: "name4",
            },
          ],
        },
      ]
    });
    expect(survey.widthMode).toBe("auto");
    expect(survey.calculateWidthMode(), "calculate width for linear veritical survey").toBe("static");

    survey.getQuestionByName("name2").startWithNewLine = false;
    expect(survey.calculateWidthMode(), "calculate width 2 startWithNewLine").toBe("responsive");

    survey.getQuestionByName("name3").startWithNewLine = false;
    expect(survey.calculateWidthMode(), "calculate width 3 startWithNewLine").toBe("responsive");

    survey.widthMode = "static";
    expect(survey.calculateWidthMode(), "calculate width 3 startWithNewLine with static").toBe("static");

  });

  test("Survey widthMode property for panel questions", () => {
    var survey = new SurveyModel({
      widthMode: "auto",
      pages: [
        {
          "elements": [
            {
              "type": "panel",
              "elements": [
                {
                  "type": "panel",
                  "elements": [
                    {
                      "name": "q1",
                    }
                  ],
                  "name": "panel2"
                }, {
                  "type": "panel",
                  "elements": [
                    {
                      "name": "q3",
                    },
                    {
                      "name": "q4",
                    }
                  ],
                  "name": "panel1",
                  "startWithNewLine": false
                }
              ],
              "name": "panel5",
            }
          ],
          "name": "page2"
        },
      ]
    });
    expect(survey.calculateWidthMode(), "calculate width for panel survey").toBe("responsive");
  });

  test("Survey widthMode property for matrices questions", () => {
    var survey3 = new SurveyModel({
      pages: [
        {
          "elements": [
            {
              "type": "matrix",
              "name": "question1",
              "columns": [
                "Column 1",
                "Column 2",
                "Column 3"
              ],
              "rows": [
                "Row 1",
                "Row 2"
              ]
            },
            {
              "type": "text",
              "name": "question2"
            }
          ]
        },
      ]
    });
    expect(survey3.widthMode).toBe("auto");
    expect(survey3.calculateWidthMode(), "calculate width for survey with matrices").toBe("responsive");
  });

  test("Survey widthMode for 'input per page'", () => {
    var survey3 = new SurveyModel({
      pages: [
        {
          "elements": [
            {
              "type": "matrix",
              "name": "question1",
              "columns": [
                "Column 1",
                "Column 2",
                "Column 3"
              ],
              "rows": [
                "Row 1",
                "Row 2"
              ]
            },
            {
              "type": "text",
              "name": "question2"
            }
          ]
        },
      ]
    });
    expect(survey3.widthMode).toBe("auto");
    expect(survey3.calculateWidthMode(), "calculate width for survey with matrices in standard mode").toBe("responsive");
    survey3.questionsOnPageMode = "inputPerPage";
    expect(survey3.calculateWidthMode(), "calculate width for survey with matrices in input per page mode").toBe("static");
  });

  test("Survey widthMode - css", () => {
    var survey = new SurveyModel({
      "elements": [
        {
          "name": "question1",
        },
      ]
    });
    survey.widthMode = "static";
    expect(survey.bodyCss, "calculate body css for static width mode").toBe(survey.css.body + " " + survey.css.body + "--static");
    survey.widthMode = "responsive";
    expect(survey.bodyCss, "calculate body css for responsive width mode").toBe(survey.css.body + " " + survey.css.body + "--responsive");
  });

  test("Survey widthMode property for rating questions", () => {
    var survey3 = new SurveyModel({
      pages: [
        {
          "elements": [
            {
              "type": "rating",
              "name": "question1"
            }
          ]
        },
      ]
    });
    var q: QuestionRatingModel = survey3.getQuestionByName("question1") as QuestionRatingModel;
    expect(survey3.widthMode).toBe("auto");
    expect(survey3.calculateWidthMode(), "default rating widthMode is static").toBe("static");
    q.rateMax = 20;
    expect(survey3.calculateWidthMode(), "big rateMax rating widthMode is responsive").toBe("responsive");
    q.rateMin = 15;
    expect(survey3.calculateWidthMode(), "big rateMin rating widthMode is static").toBe("static");
    q.rateMin = 0;
    q.rateStep = 5;
    expect(survey3.calculateWidthMode(), "big rateStep rating widthMode is static").toBe("static");
    q.minRateDescription = "desc_min";
    expect(survey3.calculateWidthMode(), "minRateDescription rating widthMode is responsive").toBe("responsive");
    q.minRateDescription = "";
    q.maxRateDescription = "desc_max";
    expect(survey3.calculateWidthMode(), "maxRateDescription rating widthMode is responsive").toBe("responsive");
    q.minRateDescription = "desc_min";
    expect(survey3.calculateWidthMode(), "both descriptions rating widthMode is responsive").toBe("responsive");

    q.displayMode = "dropdown";
    expect(survey3.calculateWidthMode(), "dropdown rating widthMode is static").toBe("static");

    survey3.fromJSON({
      pages: [
        {
          "elements": [
            {
              "type": "rating",
              "name": "question1",
              "rateValues": [
                1,
                {
                  "value": 2,
                  "text": "a"
                },
                3,
                4,
                5
              ]
            }
          ]
        },
      ]
    });
    expect(survey3.calculateWidthMode(), "rating with rate values widthMode is static").toBe("static");
  });

  test("Survey width scaling", () => {
    var survey = new SurveyModel({
      "elements": [
        {
          "name": "question1",
        },
      ]
    });
    expect(survey.widthMode).toBe("auto");
    expect(survey.width).toBeUndefined();
    expect(survey.widthScale).toBe(100);
    expect(survey.isScaled).toBe(false);
    expect(survey.renderedWidth).toBeUndefined();

    survey.responsiveStartWidth = 1000;
    survey.widthMode = "static";
    expect(survey.isScaled).toBe(false);
    expect(survey.renderedWidth).toBeUndefined();

    survey.width = "500px";
    expect(survey.isScaled).toBe(false);
    expect(survey.renderedWidth).toBe("500px");

    survey.widthScale = 75;
    expect(survey.isScaled).toBe(true);
    expect(survey.renderedWidth).toBe("375px");

    survey.widthMode = "responsive";
    expect(survey.isScaled).toBe(true);
    expect(survey.renderedWidth).toBe("750px");

    survey.setResponsiveStartWidth(1200);
    expect(survey.isScaled).toBe(true);
    expect(survey.renderedWidth).toBe("900px");
  });

  test("Question min width scaling", () => {
    var survey = new SurveyModel({
      "elements": [
        {
          "type": "text",
          "name": "question1",
        },
      ]
    });
    const q = survey.getAllQuestions()[0];
    expect(survey.widthScale).toBe(100);
    expect(q.rootStyle["minWidth"]).toBe("min(100%, 300px)");

    survey.widthScale = 50;
    expect(survey.widthScale).toBe(50);
    expect(q.rootStyle["minWidth"]).toBe("min(100%, 150px)");
  });
});
