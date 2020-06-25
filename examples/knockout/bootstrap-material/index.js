function init() {
  $.material.init();

  var mainColor = "#023670";
  var mainHoverColor = "#035bbc";
  var textColor = "#4a4a4a";
  var headerColor = "#160ce8";
  var headerBackgroundColor = "#4a4a4a";
  var bodyContainerBackgroundColor = "#f8f8f8";

  var defaultThemeColorsSurvey = Survey.StylesManager.ThemeColors["default"];
  defaultThemeColorsSurvey["$main-color"] = mainColor;
  defaultThemeColorsSurvey["$main-hover-color"] = mainHoverColor;
  defaultThemeColorsSurvey["$text-color"] = textColor;
  defaultThemeColorsSurvey["$header-color"] = headerColor;
  defaultThemeColorsSurvey["$header-background-color"] = headerBackgroundColor;
  defaultThemeColorsSurvey[
    "$body-container-background-color"
  ] = bodyContainerBackgroundColor;

  //Survey.Survey.cssType = "bootstrapmaterial";
  Survey.StylesManager.applyTheme("bootstrapmaterial");

  var json = {
    pages: [
      {
        questions: [
          {
            type: "checkbox",
            name: "car",
            title: "What car are you driving?",
            isRequired: true,
            colCount: 4,
            choices: [
              "None",
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen"
            ]
          },
          {
            type: "matrix",
            name: "Quality",
            title:
              "Please indicate if you agree or disagree with the following statements",
            columns: [
              { value: 1, text: "Strongly Disagree" },
              { value: 2, text: "Disagree" },
              { value: 3, text: "Neutral" },
              { value: 4, text: "Agree" },
              { value: 5, text: "Strongly Agree" }
            ],
            rows: [
              { value: "affordable", text: "Product is affordable" },
              {
                value: "does what it claims",
                text: "Product does what it claims"
              },
              {
                value: "better than others",
                text: "Product is better than other products on the market"
              },
              { value: "easy to use", text: "Product is easy to use" }
            ]
          },
          {
            type: "rating",
            name: "satisfaction",
            title: "How satisfied are you with the Product?",
            mininumRateDescription: "Not Satisfied",
            maximumRateDescription: "Completely satisfied"
          },
          {
            type: "rating",
            name: "recommend friends",
            visibleIf: "{satisfaction} > 3",
            title:
              "How likely are you to recommend the Product to a friend or co-worker?",
            mininumRateDescription: "Will not recommend",
            maximumRateDescription: "I will recommend"
          },
          {
            type: "comment",
            name: "suggestions",
            title: "What would make you more satisfied with the Product?"
          }
        ]
      },
      {
        questions: [
          {
            type: "radiogroup",
            name: "price to competitors",
            title: "Compared to our competitors, do you feel the Product is",
            choices: [
              "Less expensive",
              "Priced about the same",
              "More expensive",
              "Not sure"
            ]
          },
          {
            type: "radiogroup",
            name: "price",
            title: "Do you feel our current price is merited by our product?",
            choices: [
              "correct|Yes, the price is about right",
              "low|No, the price is too low for your product",
              "high|No, the price is too high for your product"
            ]
          },
          {
            type: "multipletext",
            name: "pricelimit",
            title: "What is the... ",
            items: [
              {
                name: "mostamount",
                title: "Most amount you would every pay for a product like ours"
              },
              {
                name: "leastamount",
                title: "The least amount you would feel comfortable paying"
              }
            ]
          }
        ]
      },
      {
        questions: [
          {
            type: "text",
            name: "email",
            title:
              "Thank you for taking our survey. Your survey is almost complete, please enter your email address in the box below if you wish to participate in our drawing, then press the 'Submit' button."
          }
        ]
      }
    ]
  };

  window.survey = new Survey.Model(json);
  survey.render("surveyElement");
}

if (!window["%hammerhead%"]) {
  init();
}
