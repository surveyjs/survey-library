
//Add the price property into choices
Survey.Serializer.addProperty("itemvalue", "price:number");

var getItemPrice = function (params) {
  //this.row property available in cells of dropdown and dynamic matrices questions
  var question = !!this.row
    ? this.row.getQuestionByColumnName(params[0])
    : null;
  //if we can't find a question inside the cell (by row and column name) then return
  if (!question) return 0;

  //get the selected item/choice
  var selItem = question.selectedItem;
  //return 0 if a user did not select the item yet.
  return !!selItem ? selItem.price : 0;
};
//Register the custom function
Survey.FunctionFactory.Instance.register("getItemPrice", getItemPrice);

var json = {
  "elements": [
    {
      "type": "checkbox",
      "name": "event_preferences",
      "title": "Which types of events are you interested in attending?",
      "choices": [
        {
          "value": "music",
          "text": "Music events",
          "elements": [
            {
              "type": "checkbox",
              "name": "music_event_type",
              "title": "Which type of music event would you like to attend?",
              "isRequired": true,
              "choices": [
                {
                  "value": "concert",
                  "text": "Concert",
                  "elements": [
                    {
                      "type": "text",
                      "name": "preferred_concert_genre",
                      "titleLocation": "hidden",
                      "isRequired": true,
                      "placeholder": "Enter preferred music genre (e.g., Rock, Jazz)"
                    },
                    {
                      "type": "text",
                      "name": "preferred_concert_date",
                      "titleLocation": "hidden",
                      "inputType": "month",
                      "placeholder": "Preferred date"
                    }
                  ]
                },
                {
                  "value": "festival",
                  "text": "Music festival",
                  "elements": [
                    {
                      "type": "text",
                      "name": "preferred_festival_name",
                      "titleLocation": "hidden",
                      "isRequired": true,
                      "placeholder": "Enter festival name or type"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "value": "sports",
          "text": "Sports events",
          "elements": [
            {
              "type": "checkbox",
              "name": "sports_event_type",
              "title": "Which sports events are you interested in?",
              "isRequired": true,
              "choices": [
                {
                  "value": "match",
                  "text": "Live match",
                  "elements": [
                    {
                      "type": "dropdown",
                      "name": "preferred_sport",
                      "titleLocation": "hidden",
                      "isRequired": true,
                      "choices": [
                        "Football",
                        "Basketball",
                        "Tennis"
                      ],
                      "placeholder": "Select sport"
                    }
                  ]
                },
                {
                  "value": "tournament",
                  "text": "Tournament",
                  "elements": [
                    {
                      "type": "text",
                      "name": "preferred_tournament",
                      "titleLocation": "hidden",
                      "isRequired": true,
                      "placeholder": "Enter preferred tournament (e.g., Wimbledon)"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "value": "cultural",
          "text": "Cultural events",
          "elements": [
            {
              "type": "checkbox",
              "name": "cultural_event_type",
              "title": "Which cultural event are you interested in?",
              "isRequired": true,
              "choices": [
                {
                  "value": "museum",
                  "text": "Museum exhibition",
                  "elements": [
                    {
                      "type": "text",
                      "name": "preferred_museum_theme",
                      "titleLocation": "hidden",
                      "isRequired": true,
                      "placeholder": "Enter theme or type (e.g., Art, History)"
                    }
                  ]
                },
                {
                  "value": "theater",
                  "text": "Theater performance",
                  "elements": [
                    {
                      "type": "text",
                      "name": "preferred_theater_show",
                      "titleLocation": "hidden",
                      "isRequired": true,
                      "placeholder": "Enter the name of the show"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "checkbox",
      "name": "contact_methods",
      "title": "How may we contact you?",
      "choices": [
        {
          "value": "email",
          "text": "By email",
          "elements": [
            {
              "type": "text",
              "name": "email_address",
              "titleLocation": "hidden",
              "inputType": "email",
              "placeholder": "Enter your email address"
            }
          ]
        },
        {
          "value": "phone_call",
          "text": "By phone call",
          "elements": [
            {
              "type": "text",
              "name": "phone_number_call",
              "titleLocation": "hidden",
              "isRequired": true,
              "inputType": "tel",
              "placeholder": "Enter your phone number"
            },
            {
              "type": "comment",
              "name": "preferred_call_time",
              "titleLocation": "hidden",
              "placeholder": "Enter a convenient time to call"
            }
          ]
        },
        {
          "value": "sms",
          "text": "By SMS",
          "elements": [
            {
              "type": "text",
              "name": "phone_number_sms",
              "titleLocation": "hidden",
              "valueName": "phone_number_call",
              "inputType": "tel",
              "placeholder": "Enter your phone number"
            }
          ]
        },
        {
          "value": "telegram",
          "text": "By Telegram",
          "elements": [
            {
              "type": "text",
              "name": "telegram_username",
              "titleLocation": "hidden",
              "isRequired": true,
              "placeholder": "Enter your Telegram username"
            }
          ]
        }
      ]
    }
  ]
}

// json = {
//       elements: [
//         {
//           name: "name",
//           type: "boolean",
//           title: "Question title",
//           titleLocation: "hidden"
//         }
//       ]
//     };

// Survey.StylesManager.applyTheme("default");
// Survey.StylesManager.applyTheme("modern");
// Survey.StylesManager.applyTheme("defaultV2");

var model = new Survey.Model(json);
//model.setDesignMode(true);
window.survey = model;

// class CustomTOCItem extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     const survey = this.props.model.locOwner;
//     const pageName = this.props.item.id;
//     const page = survey.getPageByName(pageName);
//     return (
//       <div style={{ width: "100%", height: "50px", background: "red", color: "lime" }}>
//         {page.title || page.name}
//       </div>
//     );
//   }
// }

// SurveyReact.ReactElementFactory.Instance.registerElement(
//   "sv-custom-toc-item",
//   (props) => {
//     return React.createElement(CustomTOCItem, props);
//   }
// );

// model.findLayoutElement("toc-navigation").data.listModel.itemComponent = "sv-custom-toc-item";

model.onUploadFiles
  .add(function (survey, options) {
    options.callback("success", options.files.map(function (file) {
      return {
        file: file,
        content: "https://surveyjs.io/Content/Images/design/Logo.svg"
      };
    }));
  });

ReactDOM.render(
  <SurveyReact.Survey model={model} />,
  document.getElementById("surveyElement")
);