import { Selector, ClientFunction } from "testcafe";

export const frameworks = ["knockout", "jquery", "react", "vue"];
export const url = "http://127.0.0.1:8080/examples/";

export const initSurvey = ClientFunction((framework, json, events) => {
  var model = new Survey.Model(json);

  var surveyComplete = function (model) {
    window.SurveyResult = model.data;
    document.getElementById("surveyResultElement").innerHTML = JSON.stringify(
      model.data
    );
  };
  if (!!events) {
    for (var str in events) {
      model[str].add(events[str]);
    }
  }
  model.onComplete.add(surveyComplete);

  if (framework === "knockout") {
    document.getElementById("surveyElement").innerHTML = "";
    model.render("surveyElement");
  } else if (framework === "jquery") {
    document.getElementById("surveyElement").innerHTML = "";
    $("#surveyElement").Survey({ model: model });
  } else if (framework === "react") {
    document.getElementById("surveyElement").innerHTML = "";
    ReactDOM.render(
      React.createElement(Survey.Survey, {
        model: model,
        onComplete: surveyComplete,
      }),
      document.getElementById("surveyElement")
    );
  } else if (framework === "vue") {
    document.getElementById("surveyElement").innerHTML =
      "<survey :survey='survey'/>";
    !!window.vueApp && vueApp.$destroy();
    window.vueApp = new Vue({
      el: "#surveyElement",
      data: { survey: model },
    });
  }

  window.survey = model;
});

export const getSurveyResult = ClientFunction(() => {
  var result = window.SurveyResult;

  if (typeof result === "undefined") {
    return result;
  }

  return JSON.parse(JSON.stringify(result)); // clean result object from the vuejs stuff
});

// export const getSurveyResult = ClientFunction(() => window.SurveyResult);

export const setOptions = ClientFunction((questionName, modValue) => {
  var mergeOptions = function (obj1, obj2) {
    for (var attrname in obj2) {
      obj1[attrname] = obj2[attrname];
    }
  };
  var q = survey.getQuestionByName(questionName || "car");
  mergeOptions(q, modValue);
  survey.render();
});

export const sumElementInnerText = ClientFunction((tagName, index) => {
  let el = document.getElementsByTagName(tagName)[index];
  const spans = el.querySelectorAll("span");
  let res = "";
  for (let i = 0; i < spans.length; i++) {
    var sp = spans[i];
    if (!sp.innerHTML || sp.innerHTML == "&nbsp;") continue;
    let childs = sp.getElementsByTagName("span");
    if (childs.length > 0) continue;
    if (!!res) res += " ";
    res += sp.innerHTML;
  }

  return res;
});
