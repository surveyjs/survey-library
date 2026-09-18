export const survey = {
  "title": "A Taste of Italy at Home",
  "description": "2972 Westheimer Rd. Santa Ana, Illinois 85486 +1 (209) 555-0104",
  "logo": "https://api.surveyjs.io/private/Surveys/files?name=76db69ce-63ed-416f-a88f-f72fc0da8017",
  "logoWidth": "688",
  "logoHeight": "auto",
  "completedHtml": "<div style=\"max-width:504px;text-align:center;margin: 0px auto 16px auto;\">\n\n<div style=\"background-color:#DD3333;padding:40px 64px 48px 48px;text-align:left;\">\n<h4 style=\"color:#fff;\">Dear {fullname-for-complete-page},</h4>\n<br>\n<p style=\"color:#fff;\">We greatly appreciate your feedback. Your input helps us improve, and we look forward to serving you even better on your next visit.</p>\n<br>\n<p style=\"color:#fff;\">Warm regards,<br> Pizza House</p>\n</div>\n\n</div>\n",
  "pages": [
    {
      "name": "page3",
      "elements": [
        {
          "type": "text",
          "name": "full-name",
          "width": "100%",
          "minWidth": "256px",
          "title": "Full name:"
        },
        {
          "type": "text",
          "name": "contact-information",
          "width": "100%",
          "minWidth": "256px",
          "title": "Email address and/or phone number:"
        },
        {
          "type": "html",
          "name": "html1",
          "html": "<div style=\"height:8px;\"></div>"
        },
        {
          "type": "text",
          "name": "date-of-visit",
          "width": "100%",
          "minWidth": "256px",
          "title": "Date of visit:",
          "inputType": "date"
        },
        {
          "type": "text",
          "name": "number-of-guests",
          "width": "100%",
          "minWidth": "256px",
          "title": "Number of guests in your party:"
        },
        {
          "type": "text",
          "name": "check-amount",
          "width": "100%",
          "minWidth": "256px",
          "title": "Check amount:"
        },
        {
          "type": "html",
          "name": "html2",
          "html": "<div style=\"height:32px;\"></div>"
        },
        {
          "type": "panel",
          "name": "ratings-panel",
          "elements": [
            {
              "type": "matrixdropdown",
              "name": "food-ratings",
              "width": "100%",
              "minWidth": "256px",
              "titleLocation": "hidden",
              "showHeader": false,
              "columns": [
                {
                  "name": "column1",
                  "cellType": "rating",
                  "rateType": "stars"
                }
              ],
              "transposeData": true,
              "choices": [
                1,
                2,
                3,
                4,
                5
              ],
              "rows": [
                {
                  "value": "food-quality",
                  "text": "Food Quality"
                },
                {
                  "value": "food-taste",
                  "text": "Food Taste"
                },
                {
                  "value": "price",
                  "text": "Price"
                }
              ]
            },
            {
              "type": "matrixdropdown",
              "name": "venue-ratings",
              "width": "100%",
              "minWidth": "auto",
              "titleLocation": "hidden",
              "showHeader": false,
              "columns": [
                {
                  "name": "column1",
                  "cellType": "rating",
                  "rateType": "stars"
                }
              ],
              "transposeData": true,
              "choices": [
                1,
                2,
                3,
                4,
                5
              ],
              "rows": [
                {
                  "value": "service",
                  "text": "Service"
                },
                {
                  "value": "ambiance",
                  "text": "Ambiance"
                },
                {
                  "value": "cleanliness",
                  "text": "Cleanliness"
                }
              ]
            },
            {
              "type": "comment",
              "name": "suggestions",
              "width": "100%",
              "minWidth": "256px",
              "title": "Your comments or suggestions",
              "titleLocation": "bottom",
              "rows": 1,
              "autoGrow": true,
              "allowResize": false
            }
          ],
          "questionTitleLocation": "top",
          "title": "Please rate the following:",
          "width": "100%",
          "minWidth": "256px"
        },
        {
          "type": "html",
          "name": "question14",
          "html": "<div style=\"height:8px;\"></div>"
        }
      ],
      "title": "Your feedback matters.",
      "description": "Please provide your feedback so that we can continue to improve our service."
    }
  ],
  "calculatedValues": [
    {
      "name": "fullname-for-complete-page",
      "expression": "iif({full-name} notempty, {full-name}, guest)"
    }
  ],
  "questionTitleLocation": "left",
  "questionDescriptionLocation": "underInput",
  "questionErrorLocation": "bottom",
  "completeText": "Submit",
  "widthMode": "static",
  "width": "768"
};

export const theme = {
  "themeName": "custom",
  "colorPalette": "light",
  "isPanelless": true,
  "backgroundImage": "",
  "backgroundOpacity": 1,
  "backgroundImageAttachment": "scroll",
  "backgroundImageFit": "cover",
  "cssVariables": {
    "--sjs-questionpanel-hovercolor": "rgba(224, 224, 224, 1)",
    "--sjs-corner-radius": "0px",
    "--sjs-base-unit": "8px",
    "--sjs-font-pagetitle-weight": "600",
    "--sjs-font-pagetitle-size": "32px",
    "--sjs-font-pagetitle-color": "rgba(221, 51, 51, 1)",
    "--sjs-font-pagedescription-color": "rgba(0, 0, 0, 0.5)",
    "--sjs-shadow-small": "inset 0px 0px 0px 1px rgba(0, 0, 0, 0.25)",
    "--sjs2-border-effect-component-panel-default": "0px 0px 0px 1px rgba(0, 0, 0, 0.25)",
    "--sjs-font-questiontitle-weight": "400",
    "--sjs-font-questiontitle-color": "rgba(0, 0, 0, 0.5)",
    "--sjs-font-questiondescription-color": "rgba(0, 0, 0, 0.5)",
    "--sjs-shadow-inner": "0px 1px 0px 0px rgba(0, 0, 0, 0.25)",
    "--sjs-font-editorfont-weight": "600",
    "--sjs-font-editorfont-color": "rgba(221, 51, 51, 1)",
    "--sjs-font-editorfont-placeholdercolor": "rgba(0, 0, 0, 0.5)",
    "--sjs-border-default": "rgba(0, 0, 0, 0.25)",
    "--sjs-border-light": "rgba(0, 0, 0, 0.25)",
    "--sjs-general-backcolor": "rgba(255, 255, 255, 1)",
    "--sjs-general-backcolor-dark": "rgba(248, 248, 248, 1)",
    "--sjs-general-backcolor-dim-light": "rgba(255, 255, 255, 0)",
    "--sjs-general-backcolor-dim-dark": "rgba(243, 243, 243, 1)",
    "--sjs-general-forecolor": "rgba(0, 0, 0, 0.91)",
    "--sjs-general-forecolor-light": "rgba(0, 0, 0, 0.45)",
    "--sjs-shadow-medium": "0px 2px 6px 0px rgba(0, 0, 0, 0.1)",
    "--sjs-shadow-large": "0px 8px 16px 0px rgba(0, 0, 0, 0.1)",
    "--sjs-border-inside": "rgba(0, 0, 0, 0.16)",
    "--sjs-special-red-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-special-green": "rgba(25, 179, 148, 1)",
    "--sjs-special-green-light": "rgba(25, 179, 148, 0.1)",
    "--sjs-special-green-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-special-blue": "rgba(67, 127, 217, 1)",
    "--sjs-special-blue-light": "rgba(67, 127, 217, 0.1)",
    "--sjs-special-blue-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-special-yellow": "rgba(255, 152, 20, 1)",
    "--sjs-special-yellow-light": "rgba(255, 152, 20, 0.1)",
    "--sjs-special-yellow-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-general-backcolor-dim": "rgba(255, 255, 255, 1)",
    "--sjs-primary-backcolor": "#DD3333",
    "--sjs-primary-backcolor-dark": "rgba(188, 26, 26, 1)",
    "--sjs-primary-backcolor-light": "rgba(221, 51, 51, 0.1)",
    "--sjs-primary-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-primary-forecolor-light": "rgba(255, 255, 255, 0.25)",
    "--sjs-special-red": "rgba(229, 10, 62, 1)",
    "--sjs-special-red-light": "rgba(229, 10, 62, 0.1)",
    "--sjs-font-surveytitle-size": "24px",
    "--sjs-font-headertitle-size": "24px",
    "--sjs-font-headertitle-color": "rgba(255, 255, 255, 1)",
    "--sjs-font-headerdescription-weight": "600",
    "--sjs-font-headerdescription-size": "16px",
    "--sjs-font-headerdescription-color": "rgba(255, 255, 255, 1)",
    "--sjs-font-headertitle-weight": "700"
  },
  "header": {
    "height": 440,
    "inheritWidthFrom": "container",
    "textAreaWidth": 360,
    "backgroundImage": "https://api.surveyjs.io/private/Surveys/files?name=e8421d0e-d2db-4c99-8a62-364b168320f6",
    "backgroundImageOpacity": 0.9,
    "logoPositionX": "center",
    "logoPositionY": "middle",
    "titlePositionX": "center",
    "descriptionPositionX": "center"
  },
  "headerView": "advanced"
};
