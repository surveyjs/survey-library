import { frameworks, url } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
import uuid from "node-uuid";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "runSurveyOneTime";
const initSurvey = ClientFunction(framework => {
  document
    .querySelector("#surveyElement")
    .insertAdjacentHTML(
      "afterend",
      [
        '<div id="clientIdContainer">',
        "<p>",
        'Your client Id: <input type="text" id="clientId" value="" onchange="document.getElementById(\'btnStartSurvey\').disabled = value == \'\'" onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">',
        '</p><pre class=" language-javascript"><code class=" language-javascript">survey<span class="token punctuation">.</span>clientId <span class="token operator">=</span> yourValue<span class="token punctuation">;</span></code></pre>',
        "<p></p>",
        "<p>",
        'Send the survey results before moving on the next Page: <input type="checkbox" id="sendResultOnPageNext"> default is false.',
        "</p><p>",
        "If you have a long survey, many your users may not finish the survey and enter the data on few pagers on only the first one. If you still want to save the information from incompleted surveys, set this property to true. The clientId property should bet set correctly, otherwise the data of others users may be ovewritten.",
        "</p>",
        '<pre class=" language-javascript"><code class=" language-javascript">survey<span class="token punctuation">.</span>sendResultOnPageNext <span class="token operator">=</span> yourvalue<span class="token punctuation">;</span></code></pre>',
        "<p></p>",
        '<input id="btnStartSurvey" type="button" disabled="true" value="Start Survey" onclick="runSurveyCheck()">',
        "</div>"
      ]
        .join()
        .replace(new RegExp(",", "g"), "")
    );

  document
    .querySelector("#clientIdContainer")
    .insertAdjacentHTML(
      "afterend",
      '<textarea id="sentResults" rows="10" readonly="true" style="width:95%"></textarea>' +
        '<div id="surveyMsg"></div>'
    );

  function onIsSurveyCompleted(success, result, response) {
    if (!success) return;
    if (result == "completed") {
      document.getElementById("surveyMsg").innerHTML =
        "You have already run the survey!";
    } else {
      window["runSurvey"]();
    }
  }

  function runSurveyCheck() {
    var clientId = document.getElementById("clientId").value;
    new window["Survey"].dxSurveyService().isCompleted(
      "47e699f7-d523-4476-8fcd-be601c91d119",
      clientId,
      onIsSurveyCompleted
    );
  }

  window["runSurveyCheck"] = runSurveyCheck;

  function surveySendResult(survey) {
    var text =
      "clientId:" +
      survey.clientId +
      ". The results are:" +
      JSON.stringify(survey.data) +
      String.fromCharCode(13, 10);
    var memo = document.getElementById("sentResults");
    memo.value = memo.value + text;
  }

  function surveyComplete(s) {
    document.getElementById("clientIdContainer").style.display = "inline";
  }

  if (framework === "knockout") {
    window["runSurvey"] = () => {
      var survey = new window["Survey"].Survey(
        {
          surveyId: "e7866476-e901-4ab7-9f38-574416387f73",
          surveyPostId: "df2a04fb-ce9b-44a6-a6a7-6183ac555a68"
        },
        "surveyElement"
      );
      survey.clientId = document.getElementById("clientId").value;
      survey.sendResultOnPageNext = document.getElementById(
        "sendResultOnPageNext"
      ).checked;
      survey.onComplete.add(function(s) {
        document.getElementById("surveyElement").innerHTML = "";
        document.getElementById("clientIdContainer").style.display = "inline";
      });
      survey.onSendResult.add(function(survey) {
        var text =
          "clientId:" +
          survey.clientId +
          ". The results are:" +
          JSON.stringify(survey.data) +
          String.fromCharCode(13, 10);
        var memo = document.getElementById("sentResults");
        memo.value = memo.value + text;
      });
      document.getElementById("clientIdContainer").style.display = "none";
    };

  } else if (framework === "react") {
    window["runSurvey"] = () => {
      var survey = new window["Survey"].Model({
        surveyId: "e7866476-e901-4ab7-9f38-574416387f73",
        surveyPostId: "df2a04fb-ce9b-44a6-a6a7-6183ac555a68",
        clientId: document.getElementById("clientId").value
      });
      document.getElementById("clientIdContainer").style.display = "none";
      survey.sendResultOnPageNext = document.getElementById(
        "sendResultOnPageNext"
      ).checked;
      window["ReactDOM"].render(
        window["React"].createElement(window["Survey"].Survey, {
          model: survey,
          onComplete: surveyComplete,
          onSendResult: surveySendResult
        }),
        document.getElementById("surveyElement")
      );
    };
  } else if (framework === "vue") {
    window["runSurvey"] = () => {
      var survey = new window["Survey"].Model(
        {
          surveyId: "e7866476-e901-4ab7-9f38-574416387f73",
          surveyPostId: "df2a04fb-ce9b-44a6-a6a7-6183ac555a68"
        },
        "surveyContainer"
      );
      survey.clientId = document.getElementById("clientId").value;
      survey.sendResultOnPageNext = document.getElementById(
        "sendResultOnPageNext"
      ).checked;
      survey.onComplete.add(surveyComplete);
      survey.onSendResult.add(surveySendResult);
      document.getElementById("clientIdContainer").style.display = "none";

      new window["Vue"]({ el: "#surveyElement", data: { survey: survey } });
    };
  }
});

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework);
    }
  );
  //TODO fix the service
  test.skip("check one time run", async t => {
    const getResultTextArea = Selector(() =>
      document.querySelector("#sentResults")
    );
    const getSurveyMsg = ClientFunction(
      () => document.getElementById("surveyMsg").innerHTML
    );
    let clientID = uuid.v1();
    let resultTextArea;

    await t
      .typeText("#clientId", clientID)
      .click("#btnStartSurvey")
      .click("div:nth-child(2) label input")
      .click("input[value=Next]")
      .click("div:nth-child(2) label input")
      .click("input[value=Next]")
      .click("input[value=Complete]");

    resultTextArea = await getResultTextArea();
    assert.equal(
      resultTextArea.value,
      `clientId:${clientID}. The results are:{"opSystem":["Windows"],"langs":["Javascript"]}\n`
    );

    await t.click("#btnStartSurvey");

    assert.equal(await getSurveyMsg(), "You have already run the survey!");
  });
  //TODO fix the service
  test.skip("send results before moving on the next page", async t => {
    const getResultTextArea = Selector(
      () => document.querySelector("#sentResults"),
      { timeout: 10000 }
    );
    let clientID = uuid.v1();
    let resultTextArea;

    await t
      .click("#sendResultOnPageNext")
      .typeText("#clientId", clientID)
      .click("#btnStartSurvey")
      .click("div:nth-child(2) label input")
      .click("input[value=Next]");

    resultTextArea = await getResultTextArea();
    assert.equal(
      resultTextArea.value,
      `clientId:${clientID}. The results are:{"opSystem":["Windows"]}\n`
    );
  });
});
