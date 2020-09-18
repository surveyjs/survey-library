function init() {
  var json = {
    "pages": [
     {
      "name": "page1",
      navigationTitle: "Title 1",
      navigationDescription: "Description 1",
      "elements": [
       {
        "type": "text",
        "name": "question1"
       }
      ]
     },
     {
      "name": "page2",
      navigationTitle: "Title 2",
      navigationDescription: "Description 2",
      "elements": [
       {
        "type": "checkbox",
        "name": "question2",
        "choices": [
         "item1",
         "item2",
         "item3"
        ]
       }
      ]
     },
     {
      "name": "page3",
      navigationTitle: "Title 3",
      navigationDescription: "Description 3",
      "elements": [
       {
        "type": "radiogroup",
        "name": "question3",
        "choices": [
         "item1",
         "item2",
         "item3"
        ]
       }
      ]
     },
     {
      "name": "page4",
      navigationTitle: "Title 4",
      navigationDescription: "Description 4",
      "elements": [
       {
        "type": "dropdown",
        "name": "question4",
        "choices": [
         "item1",
         "item2",
         "item3"
        ]
       }
      ]
     },
     {
      "name": "page5",
      navigationTitle: "Title 5",
      navigationDescription: "Description 5",
      "elements": [
       {
        "type": "comment",
        "name": "question5"
       }
      ]
     },
     {
      "name": "page6",
      navigationTitle: "Title 6",
      navigationDescription: "Description 6",
      "elements": [
       {
        "type": "rating",
        "name": "question6"
       }
      ]
     },
     {
      "name": "page7",
      navigationTitle: "Title 7",
      navigationDescription: "Description 7",
      "elements": [
       {
        "type": "boolean",
        "name": "question7"
       }
      ]
     }
    ],
    "showProgressBar": "top",
    "progressBarType": "buttons"
   };

  Survey.StylesManager.applyTheme("default");
  var model = new Survey.Model(json);
  window.survey = model;

  model.render("surveyElement");
}

if (!window["%hammerhead%"]) {
  init();
}
