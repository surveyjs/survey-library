import { Cover, CoverCell } from "../src/header";
import { SurveyModel } from "../src/survey";

import { describe, test, expect } from "vitest";
describe("header", () => {
  const getSurveyWithLogoTitleAndDescription = () => new SurveyModel({
    title: "Survey New Design Test",
    description: "Survey Description",
    logo: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
    logoPosition: "right",
    elements: [
      {
        name: "signature",
        type: "signaturepad",
        title: "Sign here",
        isRequired: true
      }
    ]
  });

  test("cell calculations", () => {
    const cover = new Cover();
    cover.survey = new SurveyModel();

    expect(cover.cells[0].style, "top left").toEqualValues({
      gridColumn: 1,
      gridRow: 1,
      "width": undefined
    });
    expect(cover.cells[0].contentStyle, "top left").toEqualValues({
      justifyContent: "flex-start",
      alignItems: "flex-start",
      textAlign: "start",
      "maxWidth": undefined,
    });
    expect(cover.cells[1].style, "top center").toEqualValues({
      gridColumn: 2,
      gridRow: 1,
      "width": undefined
    });
    expect(cover.cells[1].contentStyle, "top center").toEqualValues({
      justifyContent: "flex-start",
      alignItems: "center",
      textAlign: "center",
      "maxWidth": undefined,
    });
    expect(cover.cells[2].style, "top right").toEqualValues({
      gridColumn: 3,
      gridRow: 1,
      "width": undefined
    });
    expect(cover.cells[2].contentStyle, "top right").toEqualValues({
      justifyContent: "flex-start",
      alignItems: "flex-end",
      textAlign: "end",
      "maxWidth": undefined,
    });
  });

  test("cover maxWidth", () => {
    const cover = new Cover();
    cover.survey = new SurveyModel();
    expect(cover.inheritWidthFrom, "default inheritWidthFrom").toBe("survey");

    cover.inheritWidthFrom = "container";
    expect(cover.inheritWidthFrom, "inheritWidthFrom").toBe("container");
    expect(cover.maxWidth, "inheritWidthFrom is container").toBeUndefined();

    cover.inheritWidthFrom = "survey";
    cover.survey.width = "500";
    expect(cover.survey.widthMode, "default widthMode").toBe("auto");
    expect(cover.maxWidth, "default maxWidth").toBe("500px");

    cover.survey = new SurveyModel({ widthMode: "responsive", width: "500" });
    expect(cover.maxWidth, "survey.maxWidth is responsive").toBeUndefined();

    cover.survey = new SurveyModel({ widthMode: "static", width: "500" });
    expect(cover.maxWidth, "survey.maxWidth is static").toBe("500px");

    cover.survey = new SurveyModel({ widthMode: "static", width: "55%" });
    expect(cover.maxWidth, "survey.maxWidth is static").toBe("55%");
  });

  test("cover showTitle", () => {
    const cover = new Cover();
    const survey = new SurveyModel({
      headerView: "advanced",
      title: "Title",
      description: "Description"
    });
    cover.survey = survey;

    expect(cover.cells[6].showTitle).toBeTruthy();
    expect(cover.cells[6].showDescription).toBeTruthy();

    survey.showTitle = false;
    cover.cells.forEach((cell, index) => {
      expect(cell.showLogo, index + " showLogo").toBe(false);
      expect(cell.showTitle, index + " showTitle").toBe(false);
      expect(cell.showDescription, index + " showDescription").toBe(false);
    });
  });

  test("contentClasses", () => {
    const cover = new Cover();
    cover.survey = new SurveyModel();

    expect(cover.inheritWidthFrom, "default inheritWidthFrom").toBe("survey");
    expect(cover.maxWidth, "default maxWidth").toBeUndefined();

    cover.inheritWidthFrom = "container";
    expect(cover.inheritWidthFrom, "inheritWidthFrom").toBe("container");
    expect(cover.contentClasses, "inheritWidthFrom is container").toBe("sv-header__content sv-header__content--responsive");
    expect(cover.maxWidth, "default maxWidth container").toBeUndefined();

    cover.inheritWidthFrom = "survey";
    expect(cover.survey.widthMode, "default widthMode").toBe("auto");
    expect(cover.contentClasses, "default contentClasses").toBe("sv-header__content sv-header__content--static");
    expect(cover.maxWidth, "default maxWidth survey").toBeUndefined();

    cover.survey.widthMode = "responsive";
    expect(cover.contentClasses, "survey.widthMode is responsive").toBe("sv-header__content sv-header__content--responsive");
    expect(cover.maxWidth, "default maxWidth survey responsible").toBeUndefined();

    cover.survey.widthMode = "static";
    expect(cover.contentClasses, "survey.widthMode is static").toBe("sv-header__content sv-header__content--static");
    expect(cover.maxWidth, "default maxWidth survey static").toBeUndefined();

    cover.survey.width = "1200";
    expect(cover.maxWidth, "default maxWidth survey static number").toBe("1200px");

    cover.survey.width = "1200px";
    expect(cover.maxWidth, "default maxWidth survey static px").toBe("1200px");
  });

  test("backgroundImageStyle", () => {
    const cover = new Cover();
    cover.backgroundImage = "some_url";

    expect(cover.backgroundImageStyle, "default backgroundImageStyle").toEqualValues({
      opacity: 1,
      backgroundImage: "url(some_url)",
      backgroundSize: "cover",
    });

    cover.backgroundImageFit = "fill";
    expect(cover.backgroundImageStyle, "backgroundImageFit is fill").toEqualValues({
      opacity: 1,
      backgroundImage: "url(some_url)",
      backgroundSize: "100% 100%",
    });

    cover.backgroundImageFit = "contain";
    expect(cover.backgroundImageStyle, "backgroundImageFit is contain").toEqualValues({
      opacity: 1,
      backgroundImage: "url(some_url)",
      backgroundSize: "contain",
    });
  });

  test("grid cells - defaults", () => {
    const cover = new Cover();
    cover.survey = getSurveyWithLogoTitleAndDescription();

    cover.cells.forEach(cell => {
      expect(cell.showLogo, "logo in top left").toBe(cell["positionX"] === "left" && cell["positionY"] === "top");
      expect(cell.showTitle, "title in bottom left").toBe(cell["positionX"] === "left" && cell["positionY"] === "bottom");
      expect(cell.showDescription, "description in bottom left").toBe(cell["positionX"] === "left" && cell["positionY"] === "bottom");
    });

    expect(cover.cells[0].css, "top left cell css").toBe("sv-header__cell sv-header__cell--left sv-header__cell--top");
    expect(cover.cells[0].style, "top left cell style").toEqualValues({
      "gridColumn": 1,
      "gridRow": 1,
      "width": undefined
    });
    expect(cover.cells[0].contentStyle, "top left cell content style").toEqualValues({
      "alignItems": "flex-start",
      "justifyContent": "flex-start",
      "textAlign": "start",
      "maxWidth": undefined,
    });

    expect(cover.cells[6].css, "bottom left cell css").toBe("sv-header__cell sv-header__cell--left sv-header__cell--bottom");
    expect(cover.cells[6].style, "bottom left cell style").toEqualValues({
      "gridColumn": 1,
      "gridRow": 2,
      "width": undefined
    });
    expect(cover.cells[6].contentStyle, "bottom left cell content style").toEqualValues({
      "alignItems": "flex-start",
      "justifyContent": "flex-end",
      "textAlign": "start",
      "maxWidth": "300%",
    });
  });

  test("grid cells - all elements center+middle", () => {
    const cover = new Cover();
    cover.survey = getSurveyWithLogoTitleAndDescription();

    cover.logoPositionX = "center";
    cover.logoPositionY = "middle";
    cover.titlePositionX = "center";
    cover.titlePositionY = "middle";
    cover.descriptionPositionX = "center";
    cover.descriptionPositionY = "middle";

    cover.cells.forEach((cell, index) => {
      expect(cell.showLogo, "logo in middle center").toBe(index === 4);
      expect(cell.showTitle, "title in middle center").toBe(index === 4);
      expect(cell.showDescription, "description in middle center").toBe(index === 4);
    });

    expect(cover.cells[4].css, "middle center cell css").toBe("sv-header__cell sv-header__cell--center sv-header__cell--middle");
    expect(cover.cells[4].style, "middle center cell style").toEqualValues({
      "gridColumn": 2,
      "gridRow": 1,
      "width": undefined
    });
    expect(cover.cells[4].contentStyle, "middle center cell content style").toEqualValues({
      "alignItems": "center",
      "justifyContent": "center",
      "textAlign": "center",
      "maxWidth": undefined,
    });
  });

  test("grid cells - empty survey", () => {
    const cover = new Cover();
    cover.survey = new SurveyModel({});

    cover.cells.forEach((cell, index) => {
      expect(cell.showLogo, "no logo").toBe(false);
      expect(cell.showTitle, "no title").toBe(false);
      expect(cell.showDescription, "no description").toBe(false);
    });

    cover.survey.title = "title";
    cover.cells.forEach((cell, index) => {
      expect(cell.showLogo, "no logo").toBe(false);
      expect(cell.showTitle, "title only").toBe(index === 6);
      expect(cell.showDescription, "no description").toBe(false);
    });

    cover.survey.description = "description";
    cover.cells.forEach((cell, index) => {
      expect(cell.showLogo, "no logo").toBe(false);
      expect(cell.showTitle, "title and description: title").toBe(index === 6);
      expect(cell.showDescription, "title and description: description").toBe(index === 6);
    });

    cover.survey.logo = "logoURL";
    cover.cells.forEach((cell, index) => {
      expect(cell.showLogo, "logo, title and description: logo").toBe(index === 0);
      expect(cell.showTitle, "logo, title and description: title").toBe(index === 6);
      expect(cell.showDescription, "logo, title and description: description").toBe(index === 6);
    });
  });

  test("cell calculations - test width", () => {
    const cover = new Cover();
    cover.survey = new SurveyModel();

    expect(cover.cells[0].textAreaWidth, "default").toBeUndefined();
    expect(cover.cells[0].textAreaWidth, "equal to cover + px").toBeUndefined();

    cover.textAreaWidth = 120;
    expect(cover.textAreaWidth, "cover text width").toBe(120);
    expect(cover.cells[0].textAreaWidth, "cell text width").toBe("120px");
  });

  test("grid cells - calculate cell maxWidth", () => {
    const cover = new Cover();
    cover.survey = getSurveyWithLogoTitleAndDescription();

    cover.logoPositionX = "right";
    cover.logoPositionY = "middle";
    cover.titlePositionX = "left";
    cover.titlePositionY = "middle";
    cover.descriptionPositionX = "left";
    cover.descriptionPositionY = "middle";

    expect(cover.cells[3].contentStyle["maxWidth"], "title + description #1").toBe("200%");
    expect(cover.cells[5].contentStyle["maxWidth"], "logo #1").toBeUndefined();

    cover.descriptionPositionX = "center";
    cover.descriptionPositionY = "middle";

    expect(cover.cells[3].contentStyle["maxWidth"], "title #2").toBe("100%");
    expect(cover.cells[4].contentStyle["maxWidth"], "description #2").toBe("100%");
    expect(cover.cells[5].contentStyle["maxWidth"], "logo #2").toBeUndefined();

    cover.logoPositionX = "right";
    cover.logoPositionY = "top";
    cover.descriptionPositionX = "center";
    cover.descriptionPositionY = "bottom";

    expect(cover.cells[2].contentStyle["maxWidth"], "logo #3").toBeUndefined();
    expect(cover.cells[3].contentStyle["maxWidth"], "title #3").toBe("300%");
    expect(cover.cells[7].contentStyle["maxWidth"], "description #3").toBeUndefined();
  });

  test("cover visibleRows calculation", () => {
    const cover = new Cover();
    cover.survey = getSurveyWithLogoTitleAndDescription();

    expect(cover.getVisibleRows(), "default: logo top, title bottom, description bottom").toEqualValues([1, 3]);

    cover.logoPositionY = "top";
    cover.titlePositionY = "top";
    cover.descriptionPositionY = "top";
    expect(cover.getVisibleRows(), "all elements in top").toEqualValues([1]);

    cover.logoPositionY = "middle";
    cover.titlePositionY = "middle";
    cover.descriptionPositionY = "middle";
    expect(cover.getVisibleRows(), "all elements in middle").toEqualValues([2]);

    cover.logoPositionY = "bottom";
    cover.titlePositionY = "bottom";
    cover.descriptionPositionY = "bottom";
    expect(cover.getVisibleRows(), "all elements in bottom").toEqualValues([3]);

    cover.logoPositionY = "top";
    cover.titlePositionY = "middle";
    cover.descriptionPositionY = "bottom";
    expect(cover.getVisibleRows(), "elements in different positions").toEqualValues([1, 2, 3]);

    cover.logoPositionY = "top";
    cover.titlePositionY = "top";
    cover.descriptionPositionY = "bottom";
    expect(cover.getVisibleRows(), "two elements in top, one in bottom").toEqualValues([1, 3]);

    cover.survey = new SurveyModel({});
    expect(cover.getVisibleRows(), "empty survey").toEqualValues([1, 2, 3]);

    cover.survey.title = "Title";
    expect(cover.getVisibleRows(), "survey with title only").toEqualValues([1]);
  });

  test("should calculate correct grid positions based on logo, title and description positions", () => {
    const cover = new Cover();
    cover.survey = getSurveyWithLogoTitleAndDescription();

    cover.logoPositionX = "left";
    cover.logoPositionY = "top";
    cover.titlePositionX = "center";
    cover.titlePositionY = "middle";
    cover.descriptionPositionX = "right";
    cover.descriptionPositionY = "bottom";

    const topLeftCell = cover.cells[0];
    const middleCenterCell = cover.cells[4];
    const bottomRightCell = cover.cells[8];

    expect(topLeftCell.style).toEqualValues({
      gridRow: 1,
      gridColumn: 1,
      width: undefined,
    });

    expect(middleCenterCell.style).toEqualValues({
      gridRow: 2,
      gridColumn: 2,
      width: undefined,
    });

    expect(bottomRightCell.style).toEqualValues({
      gridRow: 3,
      gridColumn: 3,
      width: undefined,
    });
  });

  test("should handle empty rows correctly", () => {
    const cover = new Cover();
    cover.survey = getSurveyWithLogoTitleAndDescription();

    cover.logoPositionX = "left";
    cover.logoPositionY = "top";
    cover.titlePositionX = "center";
    cover.titlePositionY = "top";
    cover.descriptionPositionX = "right";
    cover.descriptionPositionY = "top";

    const middleLeftCell = cover.cells[3];
    const bottomCenterCell = cover.cells[7];

    expect(middleLeftCell.style).toEqualValues({
      gridRow: 0,
      gridColumn: 0,
      width: undefined,
      display: "none"
    });

    expect(bottomCenterCell.style).toEqualValues({
      gridRow: 0,
      gridColumn: 0,
      width: undefined,
      display: "none"
    });
  });

  test("calcGridRow with different positions", () => {
    const cover = new Cover();
    cover.survey = getSurveyWithLogoTitleAndDescription();

    // Test with all elements in different positions
    cover.logoPositionY = "top";
    cover.titlePositionY = "middle";
    cover.descriptionPositionY = "bottom";

    // Test top cell
    const topCell = cover.cells.find(cell => cell["positionY"] === "top");
    expect(topCell?.style.gridRow, "Top cell should be in row 1").toBe(1);
    expect(topCell?.style.gridColumn, "Top cell should be in column 1").toBe(1);

    // Test middle cell
    const middleCell = cover.cells.find(cell => cell["positionY"] === "middle");
    expect(middleCell?.style.gridRow, "Middle cell should be in row 2").toBe(2);
    expect(middleCell?.style.gridColumn, "Middle cell should be in column 1").toBe(1);

    // Test bottom cell
    const bottomCell = cover.cells.find(cell => cell["positionY"] === "bottom");
    expect(bottomCell?.style.gridRow, "Bottom cell should be in row 3").toBe(3);
    expect(bottomCell?.style.gridColumn, "Bottom cell should be in column 1").toBe(1);
  });

  test("calcGridRow with empty rows", () => {
    const cover = new Cover();
    cover.survey = getSurveyWithLogoTitleAndDescription();

    // Set all elements to middle row
    cover.logoPositionY = "middle";
    cover.titlePositionY = "middle";
    cover.descriptionPositionY = "middle";

    // Test cells in different rows
    const topCell = cover.cells.find(cell => cell["positionY"] === "top");
    const middleCell = cover.cells.find(cell => cell["positionY"] === "middle");
    const bottomCell = cover.cells.find(cell => cell["positionY"] === "bottom");

    expect(topCell?.style.gridRow, "Empty top row should be hidden").toBe(0);
    expect(middleCell?.style.gridRow, "Middle row should be first visible row").toBe(1);
    expect(bottomCell?.style.gridRow, "Empty bottom row should be hidden").toBe(0);
  });

  test("calcGridRow with single row content", () => {
    const cover = new Cover();
    cover.survey = getSurveyWithLogoTitleAndDescription();

    // Set all elements to bottom row
    cover.logoPositionY = "bottom";
    cover.titlePositionY = "bottom";
    cover.descriptionPositionY = "bottom";

    // Test cells in different rows
    const topCell = cover.cells.find(cell => cell["positionY"] === "top");
    const middleCell = cover.cells.find(cell => cell["positionY"] === "middle");
    const bottomCell = cover.cells.find(cell => cell["positionY"] === "bottom");

    expect(topCell?.style.gridRow, "Empty top row should be hidden").toBe(0);
    expect(middleCell?.style.gridRow, "Empty middle row should be hidden").toBe(0);
    expect(bottomCell?.style.gridRow, "Bottom row should be first visible row").toBe(1);
  });

  test("CoverCell.calcGridRow with renderedHeight", () => {
    const survey = getSurveyWithLogoTitleAndDescription();
    const cover = new Cover();
    cover.survey = survey;

    cover.logoPositionY = "bottom";
    cover.titlePositionY = "bottom";
    cover.descriptionPositionY = "bottom";

    const bottomLeftCell = cover.cells[6];
    // Test case 1: When renderedHeight is set
    cover.height = 100; // This will set renderedHeight
    expect(bottomLeftCell.style.gridRow, "#1 gridRow").toBe(3);
    expect(bottomLeftCell.style.gridColumn, "#1 gridColumn").toBe(1);

    // Test case 2: When renderedHeight is not set
    cover.height = 0; // This will unset renderedHeight
    expect(bottomLeftCell.style.gridRow, "#2 gridRow").toBe(1);
    expect(bottomLeftCell.style.gridColumn, "#2 gridColumn").toBe(1);
  });
});
