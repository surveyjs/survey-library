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
  }
);

QUnit.test("contentClasses",
  function (assert) {
    const cover = new Cover();
    cover.survey = new SurveyModel();

    assert.equal(cover.inheritWidthFrom, "survey", "default inheritWidthFrom");

    cover.inheritWidthFrom = "container";
    assert.equal(cover.inheritWidthFrom, "container", "inheritWidthFrom");
    assert.equal(cover.contentClasses, "sv-header__content sv-header__content--responsive", "inheritWidthFrom is container");

    cover.inheritWidthFrom = "survey";
    assert.equal(cover.survey.widthMode, "auto", "default widthMode");
    assert.equal(cover.contentClasses, "sv-header__content sv-header__content--static", "default contentClasses");

    cover.survey.widthMode = "responsive";
    assert.equal(cover.contentClasses, "sv-header__content sv-header__content--responsive", "survey.widthMode is responsive");

    cover.survey.widthMode = "static";
    assert.equal(cover.contentClasses, "sv-header__content sv-header__content--static", "survey.widthMode is static");
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
    assert.equal(cell.showLogo, cell["positionX"] === "left" && cell["positionY"] === "bottom", "logo in bottom left");
    assert.equal(cell.showTitle, cell["positionX"] === "left" && cell["positionY"] === "bottom", "title in bottom left");
    assert.equal(cell.showDescription, cell["positionX"] === "left" && cell["positionY"] === "bottom", "description in bottom left");
  });

  assert.equal(cover.cells[6].css, "sv-header__cell sv-header__cell--left sv-header__cell--bottom", "bottom left cell css");
  assert.deepEqual(cover.cells[6].style, {
    "gridColumn": 1,
    "gridRow": 3,
    "width": undefined
  }, "bottom left cell style");
  assert.deepEqual(cover.cells[6].contentStyle, {
    "alignItems": "flex-start",
    "justifyContent": "flex-end",
    "textAlign": "start",
    "maxWidth": undefined,
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
    "gridRow": 2,
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
    assert.equal(cell.showLogo, index === 6, "logo, title and description: logo");
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