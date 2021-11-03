import ReactDOM from "react-dom";
import { Model as KnockoutModel } from "../../src/entries/knockout";
import { Model as ReactModel, Survey as SurveyReact } from "../../src/entries/react";
import { Model as VueModel, Survey as SurveyVue } from "../../src/entries/vue";
import ReactTestUtils, { act } from "react-dom/test-utils";
import React from "react";
import Vue from "vue/dist/vue.js";
import { shallowMount } from "@vue/test-utils";

export function testQuestionMarkup(assert, json, etalon) {
  var platforms = [
    {
      name: "Knockout",
      survey: new KnockoutModel(json),
      render: (survey) => survey.render("surveyElement")
    },

    {
      name: "React",
      survey: new ReactModel(json),
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

    /*
    {
      name: "Vue",
      survey: new VueModel(),
      render: (survey, element) => {
        //survey.JSON = json;
        debugger;
        new Vue({ el: "#surveyElement", data: { survey: survey } }).$mount();
      }
    }
*/
  ];
  platforms.forEach((platform) =>{
    var surveyElement = document.createElement("div");
    surveyElement.id = "surveyElement";
    document.body.appendChild(surveyElement);
    var done = assert.async();
    platform.survey["onAfterRenderQuestion"].add(function(survey, options) {
      var all = document.getElementsByTagName("*");
      for (var i=0, max=all.length; i < max; i++) {
        all[i].removeAttribute("data-bind");
      }

      var re = /(<!--.*?-->)/g;
      var str = options.htmlElement.innerHTML;
      var newstr = str.replace(re, "");
      newstr = newstr.replace(/(\r\n|\n|\r)/gm, "");
      newstr = newstr.replace(/(>  +<)/g, "><").trim();
      assert.equal(newstr, etalon, platform.name + " rendered correctly");
      done();
    });
    platform.render(platform.survey, surveyElement);
  });
}
