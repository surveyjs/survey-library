import ReactDOM from "react-dom";
import { Model as KnockoutModel } from "../../src/entries/knockout";
import { Model as ReactModel, Survey as SurveyReact } from "../../src/entries/react";
import { Model as VueModel, Survey as SurveyVue } from "../../src/entries/vue";
import ReactTestUtils, { act } from "react-dom/test-utils";
import React from "react";
import Vue from "vue/dist/vue.js";

function format(html) {
  var tab = "\t";
  var result = "";
  var indent= "";

  html.split(/>\s*</).forEach(function(element) {
    if (element.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }

    result += indent + "<" + element + ">\r\n";

    if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input")) {
      indent += tab;
    }
  });

  return result.substring(1, result.length-3);
}

export function testQuestionMarkup(assert, json, etalon) {
  var platforms = [
    /*
    {
      name: "Knockout",
      survey: new KnockoutModel(json),
      render: (survey) => survey.render("surveyElement")
    },
    */
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
      survey: new (<any>VueModel)(json),
      render: (survey, element) => {
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
        all[i].removeAttribute("data-key");
        all[i].removeAttribute("id");
      }
      var str = options.htmlElement.children[0].innerHTML;

      var re = /(<!--.*?-->)/g;
      var newstr = str.replace(re, "");
      newstr = newstr.replace(/(\r\n|\n|\r)/gm, "");
      newstr = newstr.replace(/(>  +<)/g, "><").trim();
      assert.equal(newstr, etalon,
        newstr == etalon?
          platform.name + " rendered correctly":
          platform.name + " rendered incorrectly"+"\n==================\n"+format(newstr)+"\n------------------\n"+format(etalon)+"\n==================\n");

      done();
    });
    platform.render(platform.survey, surveyElement);
  });
}
