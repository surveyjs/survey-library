import { Cover, CoverCell } from "../src/header";
import { SurveyModel } from "../src/survey";

export default QUnit.module("header");

const getSurveyWithLogoTitleAndDescription = () => new SurveyModel({
  title: "Survey New Design Test",
  description: "Survey Description",
  logo: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
  logoPosition: "right",
  questions: [
    {
      name: "signature",
      type: "signaturepad",
      title: "Sign here",
      isRequired: true
    }
  ]
});

QUnit.test("cell calculations",
  function (assert) {
    const cover = new Cover();
    cover.survey = new SurveyModel();

    assert.deepEqual(cover.cells[0].style, {
      gridColumn: 1,
      gridRow: 1,
      "width": undefined
    }, "top left");
    assert.deepEqual(cover.cells[0].contentStyle, {
      justifyContent: "flex-start",
      alignItems: "flex-start",
      textAlign: "start",
      "maxWidth": undefined,
    }, "top left");
    assert.deepEqual(cover.cells[1].style, {
      gridColumn: 2,
      gridRow: 1,
      "width": undefined
    }, "top center");
    assert.deepEqual(cover.cells[1].contentStyle, {
      justifyContent: "flex-start",
      alignItems: "center",
      textAlign: "center",
      "maxWidth": undefined,
    }, "top center");
    assert.deepEqual(cover.cells[2].style, {
      gridColumn: 3,
      gridRow: 1,
      "width": undefined
    }, "top right");
    assert.deepEqual(cover.cells[2].contentStyle, {
      justifyContent: "flex-start",
      alignItems: "flex-end",
      textAlign: "end",
      "maxWidth": undefined,
    }, "top right");
  }
);

QUnit.test("cover maxWidth",
  function (assert) {
    const cover = new Cover();
    cover.survey = new SurveyModel();
    assert.equal(cover.inheritWidthFrom, "survey", "default inheritWidthFrom");

    cover.inheritWidthFrom = "container";
    assert.equal(cover.inheritWidthFrom, "container", "inheritWidthFrom");
    assert.equal(cover.maxWidth, false, "inheritWidthFrom is container");

    cover.inheritWidthFrom = "survey";
    cover.survey.width = "500";
    assert.equal(cover.survey.widthMode, "auto", "default widthMode");
    assert.equal(cover.maxWidth, "500px", "default maxWidth");

    cover.survey = new SurveyModel({ widthMode: "responsive", width: "500" });
    assert.equal(cover.maxWidth, false, "survey.maxWidth is responsive");

    cover.survey = new SurveyModel({ widthMode: "static", width: "500" });
    assert.equal(cover.maxWidth, "500px", "survey.maxWidth is static");

    cover.survey = new SurveyModel({ widthMode: "static", width: "55%" });
    assert.equal(cover.maxWidth, "55%", "survey.maxWidth is static");
  }
);

QUnit.test("cover showTitle",
  function (assert) {
    const cover = new Cover();
    const survey = new SurveyModel({
      headerView: "advanced",
      title: "Title",
      description: "Description"
    });
    cover.survey = survey;

    assert.ok(cover.cells[6].showTitle);
    assert.ok(cover.cells[6].showDescription);

    survey.showTitle = false;
    cover.cells.forEach((cell, index) => {
      assert.equal(cell.showLogo, false, index + " showLogo");
      assert.equal(cell.showTitle, false, index + " showTitle");
      assert.equal(cell.showDescription, false, index + " showDescription");
    });
  }
);

QUnit.test("contentClasses",
  function (assert) {
    const cover = new Cover();
    cover.survey = new SurveyModel();

    assert.equal(cover.inheritWidthFrom, "survey", "default inheritWidthFrom");
    assert.equal(cover.maxWidth, undefined, "default maxWidth");

    cover.inheritWidthFrom = "container";
    assert.equal(cover.inheritWidthFrom, "container", "inheritWidthFrom");
    assert.equal(cover.contentClasses, "sv-header__content sv-header__content--responsive", "inheritWidthFrom is container");
    assert.equal(cover.maxWidth, "", "default maxWidth container");

    cover.inheritWidthFrom = "survey";
    assert.equal(cover.survey.widthMode, "auto", "default widthMode");
    assert.equal(cover.contentClasses, "sv-header__content sv-header__content--static", "default contentClasses");
    assert.equal(cover.maxWidth, undefined, "default maxWidth survey");

    cover.survey.widthMode = "responsive";
    assert.equal(cover.contentClasses, "sv-header__content sv-header__content--responsive", "survey.widthMode is responsive");
    assert.equal(cover.maxWidth, "", "default maxWidth survey responsible");

    cover.survey.widthMode = "static";
    assert.equal(cover.contentClasses, "sv-header__content sv-header__content--static", "survey.widthMode is static");
    assert.equal(cover.maxWidth, undefined, "default maxWidth survey static");

    cover.survey.width = "1200";
    assert.equal(cover.maxWidth, "1200px", "default maxWidth survey static number");

    cover.survey.width = "1200px";
    assert.equal(cover.maxWidth, "1200px", "default maxWidth survey static px");
  }
);

QUnit.test("backgroundImageStyle",
  function (assert) {
    const cover = new Cover();
    cover.backgroundImage = "some_url";

    assert.deepEqual(cover.backgroundImageStyle, {
      opacity: 1,
      backgroundImage: "url(some_url)",
      backgroundSize: "cover",
    }, "default backgroundImageStyle");

    cover.backgroundImageFit = "fill";
    assert.deepEqual(cover.backgroundImageStyle, {
      opacity: 1,
      backgroundImage: "url(some_url)",
      backgroundSize: "100% 100%",
    }, "backgroundImageFit is fill");

    cover.backgroundImageFit = "contain";
    assert.deepEqual(cover.backgroundImageStyle, {
      opacity: 1,
      backgroundImage: "url(some_url)",
      backgroundSize: "contain",
    }, "backgroundImageFit is contain");
  }
);

QUnit.test("grid cells - defaults", function (assert) {
  const cover = new Cover();
  cover.survey = getSurveyWithLogoTitleAndDescription();

  cover.cells.forEach(cell => {
    assert.equal(cell.showLogo, cell["positionX"] === "left" && cell["positionY"] === "top", "logo in top left");
    assert.equal(cell.showTitle, cell["positionX"] === "left" && cell["positionY"] === "bottom", "title in bottom left");
    assert.equal(cell.showDescription, cell["positionX"] === "left" && cell["positionY"] === "bottom", "description in bottom left");
  });

  assert.equal(cover.cells[0].css, "sv-header__cell sv-header__cell--left sv-header__cell--top", "top left cell css");
  assert.deepEqual(cover.cells[0].style, {
    "gridColumn": 1,
    "gridRow": 1,
    "width": undefined
  }, "top left cell style");
  assert.deepEqual(cover.cells[0].contentStyle, {
    "alignItems": "flex-start",
    "justifyContent": "flex-start",
    "textAlign": "start",
    "maxWidth": undefined,
  }, "top left cell content style");

  assert.equal(cover.cells[6].css, "sv-header__cell sv-header__cell--left sv-header__cell--bottom", "bottom left cell css");
  assert.deepEqual(cover.cells[6].style, {
    "gridColumn": 1,
    "gridRow": 2,
    "width": undefined
  }, "bottom left cell style");
  assert.deepEqual(cover.cells[6].contentStyle, {
    "alignItems": "flex-start",
    "justifyContent": "flex-end",
    "textAlign": "start",
    "maxWidth": "300%",
  }, "bottom left cell content style");
});

QUnit.test("grid cells - all elements center+middle", function (assert) {
  const cover = new Cover();
  cover.survey = getSurveyWithLogoTitleAndDescription();

  cover.logoPositionX = "center";
  cover.logoPositionY = "middle";
  cover.titlePositionX = "center";
  cover.titlePositionY = "middle";
  cover.descriptionPositionX = "center";
  cover.descriptionPositionY = "middle";

  cover.cells.forEach((cell, index) => {
    assert.equal(cell.showLogo, index === 4, "logo in middle center");
    assert.equal(cell.showTitle, index === 4, "title in middle center");
    assert.equal(cell.showDescription, index === 4, "description in middle center");
  });

  assert.equal(cover.cells[4].css, "sv-header__cell sv-header__cell--center sv-header__cell--middle", "middle center cell css");
  assert.deepEqual(cover.cells[4].style, {
    "gridColumn": 2,
    "gridRow": 1,
    "width": undefined
  }, "middle center cell style");
  assert.deepEqual(cover.cells[4].contentStyle, {
    "alignItems": "center",
    "justifyContent": "center",
    "textAlign": "center",
    "maxWidth": undefined,
  }, "middle center cell content style");
});

QUnit.test("grid cells - empty survey", function (assert) {
  const cover = new Cover();
  cover.survey = new SurveyModel({});

  cover.cells.forEach((cell, index) => {
    assert.equal(cell.showLogo, false, "no logo");
    assert.equal(cell.showTitle, false, "no title");
    assert.equal(cell.showDescription, false, "no description");
  });

  cover.survey.title = "title";
  cover.cells.forEach((cell, index) => {
    assert.equal(cell.showLogo, false, "no logo");
    assert.equal(cell.showTitle, index === 6, "title only");
    assert.equal(cell.showDescription, false, "no description");
  });

  cover.survey.description = "description";
  cover.cells.forEach((cell, index) => {
    assert.equal(cell.showLogo, false, "no logo");
    assert.equal(cell.showTitle, index === 6, "title and description: title");
    assert.equal(cell.showDescription, index === 6, "title and description: description");
  });

  cover.survey.logo = "logoURL";
  cover.cells.forEach((cell, index) => {
    assert.equal(cell.showLogo, index === 0, "logo, title and description: logo");
    assert.equal(cell.showTitle, index === 6, "logo, title and description: title");
    assert.equal(cell.showDescription, index === 6, "logo, title and description: description");
  });
});

QUnit.test("cell calculations - test width",
  function (assert) {
    const cover = new Cover();
    cover.survey = new SurveyModel();

    assert.equal(cover.cells[0].textAreaWidth, undefined, "default");
    assert.equal(cover.cells[0].textAreaWidth, undefined, "equal to cover + px");

    cover.textAreaWidth = 120;
    assert.equal(cover.textAreaWidth, 120, "cover text width");
    assert.equal(cover.cells[0].textAreaWidth, "120px", "cell text width");
  }
);

QUnit.test("grid cells - calculate cell maxWidth", function (assert) {
  const cover = new Cover();
  cover.survey = getSurveyWithLogoTitleAndDescription();

  cover.logoPositionX = "right";
  cover.logoPositionY = "middle";
  cover.titlePositionX = "left";
  cover.titlePositionY = "middle";
  cover.descriptionPositionX = "left";
  cover.descriptionPositionY = "middle";

  assert.equal(cover.cells[3].contentStyle["maxWidth"], "200%", "title + description #1");
  assert.equal(cover.cells[5].contentStyle["maxWidth"], undefined, "logo #1");

  cover.descriptionPositionX = "center";
  cover.descriptionPositionY = "middle";

  assert.equal(cover.cells[3].contentStyle["maxWidth"], "100%", "title #2");
  assert.equal(cover.cells[4].contentStyle["maxWidth"], "100%", "description #2");
  assert.equal(cover.cells[5].contentStyle["maxWidth"], undefined, "logo #2");

  cover.logoPositionX = "right";
  cover.logoPositionY = "top";
  cover.descriptionPositionX = "center";
  cover.descriptionPositionY = "bottom";

  assert.equal(cover.cells[2].contentStyle["maxWidth"], undefined, "logo #3");
  assert.equal(cover.cells[3].contentStyle["maxWidth"], "300%", "title #3");
  assert.equal(cover.cells[7].contentStyle["maxWidth"], undefined, "description #3");
});

QUnit.test("cover visibleRows calculation", function (assert) {
  const cover = new Cover();
  cover.survey = getSurveyWithLogoTitleAndDescription();

  assert.deepEqual(cover.getVisibleRows(), [1, 3], "default: logo top, title bottom, description bottom");

  cover.logoPositionY = "top";
  cover.titlePositionY = "top";
  cover.descriptionPositionY = "top";
  assert.deepEqual(cover.getVisibleRows(), [1], "all elements in top");

  cover.logoPositionY = "middle";
  cover.titlePositionY = "middle";
  cover.descriptionPositionY = "middle";
  assert.deepEqual(cover.getVisibleRows(), [2], "all elements in middle");

  cover.logoPositionY = "bottom";
  cover.titlePositionY = "bottom";
  cover.descriptionPositionY = "bottom";
  assert.deepEqual(cover.getVisibleRows(), [3], "all elements in bottom");

  cover.logoPositionY = "top";
  cover.titlePositionY = "middle";
  cover.descriptionPositionY = "bottom";
  assert.deepEqual(cover.getVisibleRows(), [1, 2, 3], "elements in different positions");

  cover.logoPositionY = "top";
  cover.titlePositionY = "top";
  cover.descriptionPositionY = "bottom";
  assert.deepEqual(cover.getVisibleRows(), [1, 3], "two elements in top, one in bottom");

  cover.survey = new SurveyModel({});
  assert.deepEqual(cover.getVisibleRows(), [1, 2, 3], "empty survey");

  cover.survey.title = "Title";
  assert.deepEqual(cover.getVisibleRows(), [1], "survey with title only");
});

QUnit.test("should calculate correct grid positions based on logo, title and description positions", (assert) => {
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

  assert.deepEqual(topLeftCell.style, {
    gridRow: 1,
    gridColumn: 1,
    width: undefined,
  });

  assert.deepEqual(middleCenterCell.style, {
    gridRow: 2,
    gridColumn: 2,
    width: undefined,
  });

  assert.deepEqual(bottomRightCell.style, {
    gridRow: 3,
    gridColumn: 3,
    width: undefined,
  });
});

QUnit.test("should handle empty rows correctly", (assert) => {
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

  assert.deepEqual(middleLeftCell.style, {
    gridRow: 0,
    gridColumn: 0,
    width: undefined,
    display: "none"
  });

  assert.deepEqual(bottomCenterCell.style, {
    gridRow: 0,
    gridColumn: 0,
    width: undefined,
    display: "none"
  });
});

QUnit.test("calcGridRow with different positions", function(assert) {
  const cover = new Cover();
  cover.survey = getSurveyWithLogoTitleAndDescription();

  // Test with all elements in different positions
  cover.logoPositionY = "top";
  cover.titlePositionY = "middle";
  cover.descriptionPositionY = "bottom";

  // Test top cell
  const topCell = cover.cells.find(cell => cell["positionY"] === "top");
  assert.equal(topCell?.style.gridRow, 1, "Top cell should be in row 1");
  assert.equal(topCell?.style.gridColumn, 1, "Top cell should be in column 1");

  // Test middle cell
  const middleCell = cover.cells.find(cell => cell["positionY"] === "middle");
  assert.equal(middleCell?.style.gridRow, 2, "Middle cell should be in row 2");
  assert.equal(middleCell?.style.gridColumn, 1, "Middle cell should be in column 1");

  // Test bottom cell
  const bottomCell = cover.cells.find(cell => cell["positionY"] === "bottom");
  assert.equal(bottomCell?.style.gridRow, 3, "Bottom cell should be in row 3");
  assert.equal(bottomCell?.style.gridColumn, 1, "Bottom cell should be in column 1");
});

QUnit.test("calcGridRow with empty rows", function(assert) {
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

  assert.equal(topCell?.style.gridRow, 0, "Empty top row should be hidden");
  assert.equal(middleCell?.style.gridRow, 1, "Middle row should be first visible row");
  assert.equal(bottomCell?.style.gridRow, 0, "Empty bottom row should be hidden");
});

QUnit.test("calcGridRow with single row content", function(assert) {
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

  assert.equal(topCell?.style.gridRow, 0, "Empty top row should be hidden");
  assert.equal(middleCell?.style.gridRow, 0, "Empty middle row should be hidden");
  assert.equal(bottomCell?.style.gridRow, 1, "Bottom row should be first visible row");
});

QUnit.test("CoverCell.calcGridRow with renderedHeight", function(assert) {
  const survey = getSurveyWithLogoTitleAndDescription();
  const cover = new Cover();
  cover.survey = survey;

  cover.logoPositionY = "bottom";
  cover.titlePositionY = "bottom";
  cover.descriptionPositionY = "bottom";

  const bottomLeftCell = cover.cells[6];
  // Test case 1: When renderedHeight is set
  cover.height = 100; // This will set renderedHeight
  assert.equal(bottomLeftCell.style.gridRow, 3, "#1 gridRow");
  assert.equal(bottomLeftCell.style.gridColumn, 1, "#1 gridColumn");

  // Test case 2: When renderedHeight is not set
  cover.height = 0; // This will unset renderedHeight
  assert.equal(bottomLeftCell.style.gridRow, 1, "#2 gridRow");
  assert.equal(bottomLeftCell.style.gridColumn, 1, "#2 gridColumn");
});