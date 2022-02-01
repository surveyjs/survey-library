import { ClientFunction, Selector } from "testcafe";
const minimist = require("minimist");

const args = minimist(process.argv.slice(2));
const environment = args.env;

export const frameworks = environment ? [environment] : ["knockout", "react", "vue"];
console.log("Frameworks: " + frameworks.join(", "));
export const url = "http://127.0.0.1:8080/examples_test/default/";
export const url_test = "http://127.0.0.1:8080/examples_test/";
export const FLOAT_PRECISION = 0.01;

export const initSurvey = ClientFunction(
  (framework, json, events, isDesignMode, props) => {
    console.error = msg => {
      throw new Error(msg);
    };
    console.warn = msg => {
      throw new Error(msg);
    };
    console.log("surveyjs console.error and console.warn override");

    const model = new Survey.Model(json);
    model.setDesignMode(isDesignMode);
    const surveyComplete = function (model) {
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
    if (!!props) {
      for (var key in props) {
        model[key] = props[key];
      }
    }
    model.onComplete.add(surveyComplete);

    if (framework === "knockout") {
      document.getElementById("surveyElement").innerHTML = "";
      model.render("surveyElement");
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
  }
);

export const registerCustomToolboxComponent = ClientFunction(
  (framework, json, events, isDesignMode, props) => {
    if (framework === "knockout") {
      ko.components.register("svc-custom-action", {
        viewModel: {
          createViewModel: (params) => {
            return params.item;
          },
        },
        template: `<div class="my-custom-action-class" data-bind="click: function() { $data.action() }, text: $data.title"></div>`
      });
    } else if (framework === "react") {
      class CustomActionButton extends React.Component {
        click = () => {
          this.props.item.action();
        }
        render() {
          return (
            <div className="my-custom-action-class" onClick={this.click}> {this.props.item.title}</div>
          );
        }
      }

      Survey.ReactElementFactory.Instance.registerElement("svc-custom-action", (props) => {
        return React.createElement(CustomActionButton, props);
      });

    } else if (framework === "vue") {
      Vue.component('svc-custom-action', {
        props: {
          item: {}
        },
        template: '<div class="my-custom-action-class" data-bind="click: function() { $data.action() }">{{ item.title }}</div>'
      });
    }
  }
);

export const getSurveyResult = ClientFunction(() => {
  var result = window.SurveyResult;
  if (typeof result === "undefined") {
    return result;
  }
  //clean result object from the vuejs stuff
  return JSON.parse(JSON.stringify(result));
});

export const getData = ClientFunction(() => {
  return survey.data;
});

export const setData = ClientFunction(newData => {
  survey.data = newData;
  survey.render();
});

export const setOptions = ClientFunction((questionName, modValue) => {
  const mergeOptions = function (obj1, obj2) {
    for (const attrname in obj2) {
      obj1[attrname] = obj2[attrname];
    }
  };
  const q = survey.getQuestionByName(questionName || "car");
  mergeOptions(q, modValue);
  survey.render();
});

export const joinElementInnerText = ClientFunction((tagName, index) => {
  const el = document.getElementsByTagName(tagName)[index];
  const spans = el.querySelectorAll("span");
  let res = "";
  for (let i = 0; i < spans.length; i++) {
    const sp = spans[i];
    if (!sp.innerHTML || sp.innerHTML == "&nbsp;") continue;
    const childs = sp.getElementsByTagName("span");
    if (childs.length > 0) continue;
    if (!!res) res += " ";
    res += sp.innerHTML;
  }
  return res;
});

export const getQuestionValue = ClientFunction(() => {
  return survey.getAllQuestions()[0].value;
});

export const getQuestionJson = ClientFunction(() => {
  return JSON.stringify(survey.getAllQuestions()[0].toJSON());
});

export const getPanelJson = ClientFunction(() => {
  return JSON.stringify(survey.getAllPanels()[0].toJSON());
});

export function getDynamicPanelRemoveButton(questionTitle, buttonText) {
  return Selector("span").withText(`${questionTitle}`).parent("[aria-labelledby]").find("span").withText(buttonText)
}

export async function checkSurveyWithEmptyQuestion(t) {
  const requiredMessage = Selector(".sv-string-viewer").withText("Response required.");

  await t
    .expect(requiredMessage.exists).notOk()
    .click("input[value=Complete]")
    .expect(requiredMessage.visible).ok()

  let surveyResult = await getSurveyResult();
  await t.expect(typeof surveyResult).eql("undefined");
}