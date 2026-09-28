import { countryChoices } from "./country-choices";

export const survey = {
  "title": "HOTEL BY THE SEA",
  "description": "1901 Thornridge Cir. Shiloh, Hawaii 81063 +1 (808) 555-0111",
  "logo": "https://api.surveyjs.io/private/Surveys/files?name=cd99ec15-4054-4e75-8e42-9edff605a5d4",
  "logoWidth": "auto",
  "logoHeight": "80",
  "completedHtml": "<div style=\"max-width:688px;text-align:center;margin: 16px auto;\">\n\n<div style=\"padding:0 24px;\">\n<h4>Thank you for choosing us.</h4>\n<br>\n<p>Dear {firstname-for-complete-page}, we're thrilled to have you on board and excited to be a part of your upcoming journey. Your reservation is confirmed, and we can't wait to make your travel experience exceptional.</p>\n</div>\n\n</div>\n",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "check-in-date",
          "width": "37%",
          "minWidth": "256px",
          "titleLocation": "hidden",
          "description": "Check-in",
          "descriptionLocation": "underInput",
          "defaultValueExpression": "today()",
          "validators": [
            {
              "type": "expression",
              "text": "Check-in date cannot precede today's date.",
              "expression": "{check-in-date} >= today()"
            }
          ],
          "inputType": "date",
          "placeholder": "Check-in"
        },
        {
          "type": "text",
          "name": "check-out-date",
          "width": "37%",
          "minWidth": "256px",
          "startWithNewLine": false,
          "titleLocation": "hidden",
          "description": "Check-out",
          "descriptionLocation": "underInput",
          "defaultValueExpression": "today(1)",
          "validators": [
            {
              "type": "expression",
              "text": "Invalid date range: check-out date cannot precede check-in date.",
              "expression": "getDate({check-out-date}) >= getDate({check-in-date})"
            }
          ],
          "inputType": "date",
          "placeholder": "Check-out"
        },
        {
          "type": "dropdown",
          "name": "number-of-guests",
          "width": "26%",
          "minWidth": "192px",
          "startWithNewLine": false,
          "titleLocation": "hidden",
          "choices": [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            {
              "value": "10",
              "text": "10+"
            }
          ],
          "placeholder": "# of guests",
          "allowClear": false
        },
        {
          "type": "dropdown",
          "name": "room-type",
          "useDisplayValuesInDynamicTexts": false,
          "width": "74%",
          "minWidth": "256px",
          "titleLocation": "hidden",
          "choices": [
            {
              "value": "queen",
              "text": "Queen Room"
            },
            {
              "value": "king",
              "text": "King Room"
            },
            {
              "value": "deluxe-king",
              "text": "Deluxe King Room"
            },
            {
              "value": "superior-king",
              "text": "Superior King Room"
            }
          ],
          "placeholder": "Room type",
          "allowClear": false
        },
        {
          "type": "checkbox",
          "name": "non-smoking",
          "width": "26%",
          "minWidth": "192px",
          "startWithNewLine": false,
          "titleLocation": "hidden",
          "choices": [
            {
              "value": "true",
              "text": "Non-smoking"
            }
          ]
        },
        {
          "type": "image",
          "name": "king-room-image",
          "visibleIf": "{room-type} = 'king'",
          "width": "37%",
          "minWidth": "192px",
          "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=31ba1c67-201e-458e-b30b-86b45ba25f40",
          "imageFit": "cover",
          "imageHeight": "224",
          "imageWidth": "1000"
        },
        {
          "type": "html",
          "name": "king-room-description",
          "visibleIf": "{room-type} = 'king'",
          "width": "63%",
          "minWidth": "256px",
          "startWithNewLine": false,
          "html": "<h4 style=\"padding-top:16px\">King Room</h4>\n<p style=\"padding-top:8px;font-size:14px;\">\nOur King Room offers spacious luxury with a king-sized bed for a great night's sleep. Stay connected with complimentary Wi-Fi, refresh in the private bathroom, and enjoy in-room entertainment with a flat-screen TV. Keep your favorite beverages cool in the mini-fridge, and start your day right with a coffee from the in-room coffee maker. The ideal retreat for your travels.\n</p>\n\n"
        },
        {
          "type": "image",
          "name": "deluxe-king-room-image",
          "visibleIf": "{room-type} = 'deluxe-king'",
          "width": "37%",
          "minWidth": "192px",
          "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=4fc633b5-0ac3-48f5-9728-284446e72adf",
          "imageFit": "cover",
          "imageHeight": "224",
          "imageWidth": "1000"
        },
        {
          "type": "html",
          "name": "deluxe-king-room-description",
          "visibleIf": "{room-type} = 'deluxe-king'",
          "width": "63%",
          "minWidth": "256px",
          "startWithNewLine": false,
          "html": "<h4 style=\"padding-top:16px\">Deluxe King Room</h4>\n<p style=\"padding-top:8px;font-size:14px;\">\nElevate your stay in our Deluxe King Room. Experience ultimate comfort on a luxurious king-sized bed. Enjoy the convenience of complimentary Wi-Fi, a private bathroom, and entertainment on a flat-screen TV. Stay refreshed with a well-stocked mini-fridge and coffee maker. With added space and upscale amenities, this room offers a touch of luxury for a truly special stay.\n</p>\n\n"
        },
        {
          "type": "image",
          "name": "queen-room-image",
          "visibleIf": "{room-type} = 'queen'",
          "width": "37%",
          "minWidth": "192px",
          "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=2e2bc916-6f2e-47ff-b321-74b34118a748",
          "imageFit": "cover",
          "imageHeight": "224",
          "imageWidth": "1000"
        },
        {
          "type": "html",
          "name": "queen-room-description",
          "visibleIf": "{room-type} = 'queen'",
          "width": "63%",
          "minWidth": "256px",
          "startWithNewLine": false,
          "html": "<h4 style=\"padding-top:16px\">Queen Room</h4>\n<p style=\"padding-top:8px;font-size:14px;\">\nExperience comfort and convenience in our Queen Room. Unwind on a cozy queen-sized bed, stay connected with complimentary Wi-Fi, and enjoy the convenience of a private bathroom. For your entertainment, there's a flat-screen TV. A mini-fridge and coffee maker are at your disposal for added convenience. Your perfect choice for a relaxing stay.\n</p>\n\n"
        },
        {
          "type": "image",
          "name": "superior-king-room-image",
          "visibleIf": "{room-type} = 'superior-king'",
          "width": "37%",
          "minWidth": "192px",
          "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=e16770dd-818c-4847-8b7f-19ee527420c1",
          "imageFit": "cover",
          "imageHeight": "224",
          "imageWidth": "1000"
        },
        {
          "type": "html",
          "name": "superior-king-room-description",
          "visibleIf": "{room-type} = 'superior-king'",
          "width": "63%",
          "minWidth": "256px",
          "startWithNewLine": false,
          "html": "<h4 style=\"padding-top:16px\">Superior King Room</h4>\n<p style=\"padding-top:8px;font-size:14px;\">\nIndulge in the epitome of luxury in our Superior King Room. Experience ample space and opulence with a king-sized bed. Complimentary Wi-Fi keeps you connected, while the private bathroom and flat-screen TV provide comfort and entertainment. Enjoy the convenience of a well-equipped mini-fridge and coffee maker. This room is the top choice for a superior and memorable stay.\n</p>\n\n"
        },
        {
          "type": "dropdown",
          "name": "number-of-rooms",
          "width": "37%",
          "minWidth": "192px",
          "titleLocation": "hidden",
          "choices": [
            1,
            2,
            3,
            4,
            5
          ],
          "placeholder": "# of rooms",
          "allowClear": false
        },
        {
          "type": "checkbox",
          "name": "with-pets",
          "width": "63%",
          "minWidth": "256px",
          "startWithNewLine": false,
          "titleLocation": "hidden",
          "choices": [
            {
              "value": "true",
              "text": "I am traveling with pets"
            }
          ]
        },
        {
          "type": "tagbox",
          "name": "extras",
          "width": "100%",
          "minWidth": "256px",
          "titleLocation": "hidden",
          "choices": [
            "Breakfast",
            "Fitness",
            "Parking",
            "Swimming pool",
            "Restaurant",
            "Spa"
          ],
          "placeholder": "Extras"
        },
        {
          "type": "comment",
          "name": "notes",
          "width": "100%",
          "minWidth": "256px",
          "titleLocation": "hidden",
          "placeholder": "Notes...",
          "autoGrow": true,
          "allowResize": false
        }
      ]
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "text",
          "name": "last-name",
          "width": "64%",
          "minWidth": "192px",
          "titleLocation": "hidden",
          "description": "Must match the passport exactly",
          "descriptionLocation": "underInput",
          "placeholder": "Last name"
        },
        {
          "type": "text",
          "name": "first-name",
          "width": "36%",
          "minWidth": "256px",
          "startWithNewLine": false,
          "titleLocation": "hidden",
          "placeholder": "First name"
        },
        {
          "type": "text",
          "name": "address-line-1",
          "width": "100%",
          "minWidth": "256px",
          "titleLocation": "hidden",
          "descriptionLocation": "underInput",
          "placeholder": "Address line 1"
        },
        {
          "type": "text",
          "name": "address-line-2",
          "width": "100%",
          "minWidth": "256px",
          "titleLocation": "hidden",
          "placeholder": "Address line 2"
        },
        {
          "type": "text",
          "name": "city",
          "width": "36%",
          "minWidth": "256px",
          "titleLocation": "hidden",
          "placeholder": "City"
        },
        {
          "type": "text",
          "name": "zip",
          "width": "28%",
          "minWidth": "192px",
          "startWithNewLine": false,
          "titleLocation": "hidden",
          "placeholder": "Zip code"
        },
        {
          "type": "text",
          "name": "state",
          "width": "36%",
          "minWidth": "256px",
          "startWithNewLine": false,
          "titleLocation": "hidden",
          "placeholder": "State"
        },
        {
          "type": "dropdown",
          "name": "country",
          "width": "36%",
          "minWidth": "256px",
          "titleLocation": "hidden",
          "choices": countryChoices,
          "placeholder": "Country",
          "allowClear": false
        },
        {
          "type": "text",
          "name": "phone",
          "width": "64%",
          "minWidth": "192px",
          "startWithNewLine": false,
          "titleLocation": "hidden",
          "description": "Example: +1 (555) 777-55-22",
          "descriptionLocation": "underInput",
          "placeholder": "Phone"
        }
      ]
    }
  ],
  "calculatedValues": [
    {
      "name": "firstname-for-complete-page",
      "expression": "iif({first-name} notempty, {first-name}, guests)"
    }
  ],
  "showPrevButton": false,
  "questionErrorLocation": "bottom",
  "pagePrevText": "Booking Details",
  // eslint-disable-next-line surveyjs/eslint-plugin-i18n/only-english-or-code
  "pageNextText": "Traveler Info ➝",
  "completeText": "Book Now",
  "widthMode": "static",
  "width": "904"
};

export const theme = {
  "backgroundImage": "https://api.surveyjs.io/private/Surveys/files?name=f431e65e-66fb-4ecc-9d56-e7ab74351181",
  "backgroundImageFit": "cover",
  "backgroundImageAttachment": "fixed",
  "backgroundOpacity": 1,
  "cssVariables": {
    "--sjs-general-backcolor": "rgba(255, 255, 255, 1)",
    "--sjs-general-backcolor-dark": "rgba(248, 248, 248, 1)",
    "--sjs-general-backcolor-dim": "#F1F4F6",
    "--sjs-general-backcolor-dim-light": "rgba(255, 255, 255, 1)",
    "--sjs-general-backcolor-dim-dark": "rgba(243, 243, 243, 1)",
    "--sjs-general-forecolor": "rgba(0, 0, 0, 0.91)",
    "--sjs-general-forecolor-light": "rgba(0, 0, 0, 0.45)",
    "--sjs-primary-backcolor": "#4B5D6D",
    "--sjs-primary-backcolor-light": "rgba(75, 93, 109, 0.1)",
    "--sjs-primary-backcolor-dark": "rgba(65, 80, 94, 1)",
    "--sjs-primary-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-primary-forecolor-light": "rgba(255, 255, 255, 0.25)",
    "--sjs-base-unit": "8px",
    "--sjs-corner-radius": "6px",
    "--sjs-shadow-small": "0px 0px 0px 1px rgba(0, 0, 0, 0.03), 0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 8px 16px 0px rgba(0, 0, 0, 0.05)",
    "--sjs-shadow-medium": "0px 2px 6px 0px rgba(0, 0, 0, 0.1)",
    "--sjs-shadow-large": "0px 8px 16px 0px rgba(0, 0, 0, 0.1)",
    "--sjs-shadow-inner": "0px 0px 0px 1px rgba(0, 0, 0, 0.03), 0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 8px 16px 0px rgba(0, 0, 0, 0.05)",
    "--sjs-border-light": "rgba(0, 0, 0, 0.1)",
    "--sjs-border-default": "rgba(0, 0, 0, 0.15)",
    "--sjs-border-inside": "rgba(0, 0, 0, 0.16)",
    "--sjs-special-red": "rgba(229, 10, 62, 1)",
    "--sjs-special-red-light": "rgba(229, 10, 62, 0.1)",
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
    "--sjs-editorpanel-hovercolor": "rgba(241, 244, 246, 1)",
    "--sjs-font-editorfont-placeholdercolor": "rgba(0, 0, 0, 0.5)",
    "--sjs-font-editorfont-color": "rgba(0, 0, 0, 0.9)",
    "--sjs-font-questiontitle-color": "rgba(0, 0, 0, 0.9)",
    "--sjs-font-pagetitle-color": "rgba(0, 0, 0, 0.9)",
    "--sjs-questionpanel-hovercolor": "rgba(241, 244, 246, 1)",
    "--sjs-font-questiondescription-color": "rgba(0, 0, 0, 0.5)",
    "--sjs-font-surveytitle-size": "24px",
    "--sjs-font-questiontitle-weight": "400",
    "--sjs-font-headertitle-color": "rgba(0, 0, 0, 0.9)",
    "--sjs-font-headerdescription-color": "rgba(0, 0, 0, 0.5)",
    "--sjs-font-headertitle-size": "14px",
    "--sjs-header-backcolor": "transparent",
    "--sjs-font-headerdescription-size": "14px",
    "--sjs-font-headertitle-weight": "700",
    "--sjs-font-pagetitle-weight": "700"
  },
  "isPanelless": true,
  "themeName": "default",
  "colorPalette": "light",
  "header": {
    "height": 120,
    "textAreaWidth": 280,
    "inheritWidthFrom": "survey",
    "logoPositionX": "left",
    "logoPositionY": "middle",
    "titlePositionX": "right",
    "titlePositionY": "middle",
    "descriptionPositionX": "right",
    "descriptionPositionY": "middle"
  },
  "headerView": "advanced"
};
