import ReactDOM from "react-dom";
import { Model as KnockoutModel } from "../../src/entries/knockout";
import { Model as ReactModel, Survey as SurveyReact } from "../../src/entries/react";
import { Model as VueModel, Survey as SurveyVue } from "../../src/entries/vue";
import ReactTestUtils, { act } from "react-dom/test-utils";
import React from "react";
import Vue from "vue/dist/vue.js";

export var platforms = {
  "knockout":
  {
    name: "Knockout",
    survey: null,
    surveyFactory: (json) => new KnockoutModel(json),
    render: (survey, element) => survey.render(element.id)
  },
  "react":
  {
    name: "React",
    survey: null,
    surveyFactory: (json) => new ReactModel(json),
    render: (survey, element) => {
      var component = React.createElement(SurveyReact, { model: survey }, null);
      act(()=>{
        ReactDOM.render(
          component,
          element
        );
      });
    }
  },
  "vue":
  {
    name: "Vue",
    survey: null,
    surveyFactory: (json) => new (<any>VueModel)(json),
    render: (survey, element) => {
      Vue.component("survey", SurveyVue);
      new Vue({ el: element, template: "<survey :survey='survey'/>", data: { survey: survey } });
    }
  }
};
