import { countryChoices } from "./country-choices";

export const survey = {
  // eslint-disable-next-line surveyjs/eslint-plugin-i18n/only-english-or-code
  "title": "Conferences ➔ Jun 9–11 Online Hackathon ➔ Jun 5–11",
  "logo": "https://api.surveyjs.io/private/Surveys/files?name=f30775b0-6292-48a7-8dcd-90cdfa3b378f",
  "logoWidth": "auto",
  "logoHeight": "96",
  "logoPosition": "right",
  "completedHtml": "<div style=\"max-width:752px;text-align:center;margin:0px auto 16px auto;\">\n\n<div style=\"padding:0 24px;\">\n<h2>Congrats!</h2>\n<br>\n<h4>You have successfully registered for DEV WEEKEND. Your participation is confirmed, and we can't wait to welcome you.</h4>\n</div>\n\n</div>\n",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "last-name",
          "width": "60%",
          "minWidth": "256px",
          "description": "Last name"
        },
        {
          "type": "text",
          "name": "first-name",
          "width": "40%",
          "minWidth": "256px",
          "startWithNewLine": false,
          "description": "First name"
        },
        {
          "type": "text",
          "name": "email",
          "width": "60%",
          "minWidth": "256px",
          "description": "Email address"
        },
        {
          "type": "text",
          "name": "phone",
          "width": "40%",
          "minWidth": "256px",
          "startWithNewLine": false,
          "description": "Phone number"
        },
        {
          "type": "comment",
          "name": "address",
          "width": "100%",
          "minWidth": "256px",
          "description": "Address line 1",
          "autoGrow": true,
          "allowResize": false
        },
        {
          "type": "text",
          "name": "city",
          "width": "60%",
          "minWidth": "256px",
          "description": "City"
        },
        {
          "type": "text",
          "name": "state",
          "width": "20%",
          "minWidth": "128px",
          "startWithNewLine": false,
          "description": "State"
        },
        {
          "type": "text",
          "name": "zip",
          "width": "20%",
          "minWidth": "128px",
          "startWithNewLine": false,
          "description": "Zip code"
        },
        {
          "type": "text",
          "name": "company",
          "width": "60%",
          "minWidth": "256px",
          "description": "Company"
        },
        {
          "type": "dropdown",
          "name": "job-title",
          "width": "40%",
          "minWidth": "256px",
          "startWithNewLine": false,
          "description": "Job title",
          "choices": [
            "Engineering Lead",
            "Designer",
            "Customer Support",
            "Project Manager",
            "Product Manager",
            "Software Developer",
            "CEO / Founder"
          ],
          "choicesOrder": "random",
          "showOtherItem": true,
          "otherText": "Other",
          "placeholder": "",
          "allowClear": false
        }
      ],
      "description": "Thank you for your interest in attending the Dev Weekend 2024. To reserve your seat, please fill out the information below."
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "radiogroup",
          "name": "fee-type",
          "width": "100%",
          "minWidth": "256px",
          "choices": [
            {
              "value": "full",
              "text": "$399 / Full Conference"
            },
            {
              "value": "one-day",
              "text": "$199 / One-Day Only"
            }
          ]
        },
        {
          "type": "radiogroup",
          "name": "selected-day",
          "visibleIf": "{fee-type} = 'one-day'",
          "width": "100%",
          "minWidth": "256px",
          "choices": [
            "Friday",
            "Saturday",
            "Sunday"
          ]
        }
      ],
      "title": "Registration Fee"
    },
    {
      "name": "page3",
      "elements": [
        {
          "type": "rating",
          "name": "payment-method",
          "width": "100%",
          "minWidth": "256px",
          "autoGenerate": false,
          "rateCount": 2,
          "rateValues": [
            {
              "value": "paypal",
              "text": "PayPal"
            },
            {
              "value": "card",
              "text": "Credit/Debit Card"
            }
          ]
        },
        {
          "type": "text",
          "name": "card-number",
          "visibleIf": "{payment-method} = 'card'",
          "width": "60%",
          "minWidth": "256px",
          "description": "Card number"
        },
        {
          "type": "text",
          "name": "card-exp-date",
          "visibleIf": "{payment-method} = 'card'",
          "width": "40%",
          "minWidth": "256px",
          "startWithNewLine": false,
          "description": "Exp. date",
          "inputType": "date"
        },
        {
          "type": "text",
          "name": "cardholder-name",
          "visibleIf": "{payment-method} = 'card'",
          "width": "60%",
          "minWidth": "256px",
          "description": "Cardholder name"
        },
        {
          "type": "text",
          "name": "card-cvc",
          "visibleIf": "{payment-method} = 'card'",
          "width": "40%",
          "minWidth": "256px",
          "startWithNewLine": false,
          "description": "CVC"
        }
      ],
      "title": "Payment Method"
    },
    {
      "name": "page4",
      "elements": [
        {
          "type": "text",
          "name": "billing-address",
          "width": "60%",
          "minWidth": "256px",
          "description": "Address line 1"
        },
        {
          "type": "text",
          "name": "billing-address-city",
          "width": "40%",
          "minWidth": "256px",
          "startWithNewLine": false,
          "description": "City"
        },
        {
          "type": "dropdown",
          "name": "billing-address-country",
          "width": "60%",
          "minWidth": "256px",
          "description": "Country",
          "choices": countryChoices,
          "placeholder": "",
          "allowClear": false
        },
        {
          "type": "text",
          "name": "billing-address-state",
          "width": "20%",
          "minWidth": "128px",
          "startWithNewLine": false,
          "description": "State"
        },
        {
          "type": "text",
          "name": "billing-address-zip",
          "width": "20%",
          "minWidth": "128px",
          "startWithNewLine": false,
          "description": "Zip code"
        }
      ],
      "title": "Billing Address"
    }
  ],
  "questionTitleLocation": "hidden",
  "questionDescriptionLocation": "underInput",
  "completeText": "Proceed",
  "questionsOnPageMode": "singlePage",
  "widthMode": "static",
  "width": "900"
};

export const theme = {
  "backgroundImage": "https://api.surveyjs.io/private/Surveys/files?name=e3cb0700-8696-43d3-ab8a-3309fcd3f637",
  "backgroundImageFit": "cover",
  "backgroundImageAttachment": "scroll",
  "backgroundOpacity": 0.5,
  "isPanelless": true,
  "cssVariables": {
    "--sjs-general-backcolor": "rgba(56, 10, 83, 1)",
    "--sjs-general-backcolor-dark": "rgba(52, 52, 52, 1)",
    "--sjs-general-backcolor-dim": "#380A53",
    "--sjs-general-backcolor-dim-light": "rgba(70, 26, 93, 1)",
    "--sjs-general-backcolor-dim-dark": "rgba(46, 46, 46, 1)",
    "--sjs-general-forecolor": "rgba(255, 255, 255, 0.78)",
    "--sjs-general-forecolor-light": "rgba(255, 255, 255, 0.42)",
    "--sjs-primary-backcolor": "#FF3366",
    "--sjs-primary-backcolor-light": "rgba(70, 26, 93, 1)",
    "--sjs-primary-backcolor-dark": "rgba(70, 26, 93, 1)",
    "--sjs-primary-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-primary-forecolor-light": "rgba(255, 255, 255, 0.25)",
    "--sjs-base-unit": "10px",
    "--sjs-corner-radius": "8px",
    "--sjs-shadow-small": "0px 0px 0px 2px rgba(13, 1, 19, 1)",
    "--sjs-shadow-medium": "0px 2px 6px 0px rgba(0, 0, 0, 0.2)",
    "--sjs-shadow-large": "0px 8px 16px 0px rgba(0, 0, 0, 0.2)",
    "--sjs-shadow-inner": "0px 0px 0px 2px rgba(13, 1, 19, 1)",
    "--sjs-border-light": "rgba(255, 255, 255, 0.25)",
    "--sjs-border-default": "rgba(255, 255, 255, 0.25)",
    "--sjs-border-inside": "rgba(255, 255, 255, 0.08)",
    "--sjs-special-red": "rgba(254, 76, 108, 1)",
    "--sjs-special-red-light": "rgba(254, 76, 108, 0.1)",
    "--sjs-special-red-forecolor": "rgba(48, 48, 48, 1)",
    "--sjs-special-green": "rgba(36, 197, 164, 1)",
    "--sjs-special-green-light": "rgba(36, 197, 164, 0.1)",
    "--sjs-special-green-forecolor": "rgba(48, 48, 48, 1)",
    "--sjs-special-blue": "rgba(91, 151, 242, 1)",
    "--sjs-special-blue-light": "rgba(91, 151, 242, 0.1)",
    "--sjs-special-blue-forecolor": "rgba(48, 48, 48, 1)",
    "--sjs-special-yellow": "rgba(255, 152, 20, 1)",
    "--sjs-special-yellow-light": "rgba(255, 152, 20, 0.1)",
    "--sjs-special-yellow-forecolor": "rgba(48, 48, 48, 1)",
    "--font-family": "Courier New, monospace",
    "--sjs-editorpanel-backcolor": "rgba(70, 26, 93, 1)",
    "--sjs-editorpanel-hovercolor": "rgba(97, 53, 121, 1)",
    "--sjs-questionpanel-backcolor": "rgba(56, 10, 83, 1)",
    "--sjs-questionpanel-hovercolor": "rgba(70, 26, 93, 1)",
    "--sjs-font-editorfont-color": "rgba(255, 51, 102, 1)",
    "--sjs-font-editorfont-placeholdercolor": "rgba(134, 83, 162, 1)",
    "--sjs-font-questiondescription-color": "rgba(134, 83, 162, 1)",
    "--sjs-font-questiontitle-color": "rgba(134, 83, 162, 1)",
    "--sjs-font-size": "16px",
    "--sjs-editorpanel-cornerRadius": "8px",
    "--sjs-font-pagetitle-color": "rgba(255, 51, 102, 1)",
    "--sjs-font-pagetitle-weight": "600",
    "--sjs-font-questiondescription-size": "18px",
    "--sjs-font-editorfont-weight": "600",
    "--sjs-font-questiondescription-weight": "600",
    "--sjs-font-pagedescription-color": "rgba(134, 83, 162, 1)",
    "--sjs-font-pagedescription-weight": "600",
    "--sjs-font-surveytitle-size": "24px",
    "--sjs-font-pagedescription-size": "18px",
    "--sjs-font-questiontitle-size": "18px",
    "--sjs-font-editorfont-size": "18px",
    "--sjs-header-backcolor": "transparent",
    "--sjs-font-headertitle-color": "rgba(255, 51, 102, 1)",
    "--sjs-font-headertitle-weight": "600",
    "--sjs-font-family": "Courier New, monospace",
    "--sjs-font-headertitle-size": "24px",
    "--sjs-font-pagetitle-size": "32px",
    "--sjs-font-headerdescription-size": "20px"
  },
  "themeName": "default",
  "colorPalette": "light",
  "header": {
    "height": 224,
    "inheritWidthFrom": "survey",
    "textAreaWidth": 400,
    "overlapEnabled": false,
    "backgroundImageOpacity": 1,
    "backgroundImageFit": "cover",
    "logoPositionX": "left",
    "logoPositionY": "top",
    "titlePositionX": "right",
    "titlePositionY": "bottom",
    "descriptionPositionX": "right",
    "descriptionPositionY": "top"
  },
  "headerView": "advanced"
};
