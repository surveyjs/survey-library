import { Cover, CoverCell } from "../src/cover";
import { SurveyModel } from "../src/survey";

export default QUnit.module("cover");

const surveyWithLogoTitkleAndDescription = new SurveyModel({
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

    assert.deepEqual(cover.cells[0].style, {
      gridColumn: 1,
      gridRow: 1,
    }, "top left");
    assert.deepEqual(cover.cells[0].contentStyle, {
      justifyContent: "flex-start",
      alignItems: "flex-start",
      textAlign: "start"
    }, "top left");
    assert.deepEqual(cover.cells[1].style, {
      gridColumn: 2,
      gridRow: 1,
    }, "top center");
    assert.deepEqual(cover.cells[1].contentStyle, {
      justifyContent: "flex-start",
      alignItems: "center",
      textAlign: "center"
    }, "top center");
    assert.deepEqual(cover.cells[2].style, {
      gridColumn: 3,
      gridRow: 1,
    }, "top right");
    assert.deepEqual(cover.cells[2].contentStyle, {
      justifyContent: "flex-start",
      alignItems: "flex-end",
      textAlign: "end"
    }, "top right");
  }
);

QUnit.test("cover maxWidth",
  function (assert) {
    const cover = new Cover();
    cover.survey = new SurveyModel();
    assert.equal(cover.maxWidth, undefined, "survey.maxWidth is default");

    cover.survey.width = "500";
    assert.equal(cover.survey.widthMode, "auto", "default widthMode");
    assert.equal(cover.inheritWidthFrom, "survey", "default inheritWidthFrom");
    assert.equal(cover.maxWidth, "500px", "default maxWidth");

    cover.survey = new SurveyModel({ widthMode: "responsive", width: "500" });
    assert.equal(cover.maxWidth, false, "survey.maxWidth is responsive");

    cover.survey = new SurveyModel({ widthMode: "static", width: "500" });
    assert.equal(cover.maxWidth, "500px", "survey.maxWidth is static");

    cover.inheritWidthFrom = "page";
    assert.equal(cover.maxWidth, false, "inheritWidthFrom is page");
  }
);

QUnit.test("contentClasses",
  function (assert) {
    const cover = new Cover();
    cover.survey = new SurveyModel();

    assert.equal(cover.survey.widthMode, "auto", "default widthMode");
    assert.equal(cover.inheritWidthFrom, "survey", "default inheritWidthFrom");
    assert.equal(cover.contentClasses, "sv-conver__content sv-conver__content--static", "default contentClasses");

    cover.survey.widthMode = "responsive";
    assert.equal(cover.contentClasses, "sv-conver__content sv-conver__content--responsive", "survey.widthMode is responsive");

    cover.survey.widthMode = "static";
    assert.equal(cover.contentClasses, "sv-conver__content sv-conver__content--static", "survey.widthMode is static");

    cover.inheritWidthFrom = "page";
    assert.equal(cover.contentClasses, "sv-conver__content sv-conver__content--responsive", "inheritWidthFrom is page");
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
  cover.survey = surveyWithLogoTitkleAndDescription;

  cover.cells.forEach(cell => {
    assert.equal(cell.showLogo, cell["positionX"] === "right" && cell["positionY"] === "top", "logo in top right");
    assert.equal(cell.showTitle, cell["positionX"] === "left" && cell["positionY"] === "bottom", "title in bottom left");
    assert.equal(cell.showDescription, cell["positionX"] === "left" && cell["positionY"] === "bottom", "description in bottom left");
  });

  assert.equal(cover.cells[2].css, "sv-cover__cell sv-cover__cell--right sv-cover__cell--top", "top right cell css");
  assert.deepEqual(cover.cells[2].style, {
    "gridColumn": 3,
    "gridRow": 1
  }, "top right cell style");
  assert.deepEqual(cover.cells[2].contentStyle, {
    "alignItems": "flex-end",
    "justifyContent": "flex-start",
    "textAlign": "end"
  }, "top right cell content style");

  assert.equal(cover.cells[6].css, "sv-cover__cell sv-cover__cell--left sv-cover__cell--bottom", "bottom left cell css");
  assert.deepEqual(cover.cells[6].style, {
    "gridColumn": 1,
    "gridRow": 3
  }, "bottom left cell style");
  assert.deepEqual(cover.cells[6].contentStyle, {
    "alignItems": "flex-start",
    "justifyContent": "flex-end",
    "textAlign": "start"
  }, "bottom left cell content style");
});

QUnit.test("grid cells - all elements center+middle", function (assert) {
  const cover = new Cover();
  cover.survey = surveyWithLogoTitkleAndDescription;

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

  assert.equal(cover.cells[4].css, "sv-cover__cell sv-cover__cell--center sv-cover__cell--middle", "middle center cell css");
  assert.deepEqual(cover.cells[4].style, {
    "gridColumn": 2,
    "gridRow": 2
  }, "middle center cell style");
  assert.deepEqual(cover.cells[4].contentStyle, {
    "alignItems": "center",
    "justifyContent": "center",
    "textAlign": "center"
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
    assert.equal(cell.showTitle, index === 6, "title and description");
    assert.equal(cell.showDescription, index === 6, "title and description");
  });

  cover.survey.logo = "logoURL";
  cover.cells.forEach((cell, index) => {
    assert.equal(cell.showLogo, index === 2, "logo, title and description");
    assert.equal(cell.showTitle, index === 6, "logo, title and description");
    assert.equal(cell.showDescription, index === 6, "logo, title and description");
  });
});

QUnit.test("cell calculations - test width",
  function (assert) {
    const cover = new Cover();

    assert.equal(cover.cells[0].textAreaWidth, "512px", "default");
    assert.equal(cover.cells[0].textAreaWidth, cover.textAreaWidth + "px", "equal to cover + px");

    cover.textAreaWidth = 120;
    assert.equal(cover.textAreaWidth, 120, "cover text width");
    assert.equal(cover.cells[0].textAreaWidth, "120px", "cell text width");
  }
);