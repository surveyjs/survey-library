export var markupTests = [];

export function registerMarkupTest(t) {
  markupTests.push(t);
}
export function registerMarkupTests(tests) {
  tests.forEach(t => markupTests.push(t));
}

function format(html) {
  var tab = "\t";
  var result = "";
  var indent = "";

  html.split(/>\s*</).forEach(function (element) {
    if (element.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }

    result += indent + "<" + element + ">\r\n";

    if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input")) {
      indent += tab;
    }
  });

  return result.substring(1, result.length - 3);
}

function sortAttributes(elements) {
  for (var j = 0; j < elements.length; j++) {
    var attributes = [];
    for (var i = 0; i < elements[j].attributes.length; i++) {
      var name = elements[j].attributes[i].name;
      var value = elements[j].attributes[i].value;
      ["disabled", "controls"].forEach((tag) => {
        if (name == tag && value == tag)
          value = "";
      });
      attributes.push({
        "name": name,
        "value": value
      });
    }

    var sortedAttributes = attributes.sort(
      (a1, b1) => {
        let a = a1.name.toUpperCase();
        let b = b1.name.toUpperCase();
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
        return 0;
      }
    );

    for (var i = 0; i < sortedAttributes.length; i++) {
      elements[j].removeAttribute(sortedAttributes[i]["name"]);
    }

    for (var i = 0; i < sortedAttributes.length; i++) {
      elements[j].setAttribute(sortedAttributes[i]["name"], sortedAttributes[i]["value"]);
    }
  }
}

export function testQuestionMarkup(assert, test, platform) {
  var id = "surveyElement" + platform.name;
  var surveyElement = document.getElementById(id);
  var reportElement = document.getElementById(id+"_report");
  if (surveyElement) {
    surveyElement.innerHTML = "";
  }
  else {
    surveyElement = document.createElement("div");
    surveyElement.id = id;
    surveyElement.style.display = "none";
    document.body.appendChild(surveyElement);
    reportElement = document.createElement("div");
    reportElement.id = id+"_report";
    document.body.appendChild(reportElement);
  }
  var done = assert.async();
  if (test.before)
    test.before();
  platform.survey = platform.surveyFactory(test.json);
  platform.survey.textUpdateMode = "onTyping";
  platform.survey[test.event || "onAfterRenderQuestion"].add(function (survey, options) {
    var all = options.htmlElement.getElementsByTagName("*");
    for (var i = 0, max = all.length; i < max; i++) {
      all[i].removeAttribute("aria-labelledby");
      all[i].removeAttribute("data-bind");
      all[i].removeAttribute("data-key");
      all[i].removeAttribute("data-rendered");
      all[i].removeAttribute("id");
      all[i].removeAttribute("for");
      all[i].removeAttribute("list");
      all[i].removeAttribute("fragment");
      if(all[i].getAttribute("name") !== "name")
        all[i].removeAttribute("name");
      if(all[i].checked) {
        all[i].setAttribute("checked", "");
      }
      if(all[i].multiple) {
        all[i].setAttribute("multiple", "");
      }
      if(all[i].hasAttribute("readonly"))
        all[i].setAttribute("readonly", "");
    }
    sortAttributes(all);
    var str = options.htmlElement.children[0].innerHTML;

    var re = /(<!--.*?-->)/g;
    var newstr = str.replace(re, "");
    newstr = newstr.replace(/(\r\n|\n|\r)/gm, "");
    newstr = newstr.replace(/(> +<)/g, "><").trim();

    var oldStr = test.etalon || !test.etalon && require("./snapshots/"+test.snapshot+".snap.html");
    oldStr = oldStr.replace(/(\r\n|\n|\r|\t)/gm, "");
    oldStr = oldStr.replace(/(> +<)/g, "><").trim();

    assert.equal(newstr, oldStr,
      newstr == oldStr ?
        platform.name + " " + test.name + " rendered correctly" :
        platform.name + " " + test.name + " rendered incorrectly, see http://localhost:9876/debug.html#"+test.snapshot);
    if (test.after)
      test.after();
    if(platform.finish)
      platform.finish(surveyElement);
    if(newstr != oldStr) {
      var form =document.createElement("form");
      form.action = "https://text-compare.com/";
      form.target = "_blank";
      form.method = "post";
      form.id = test.snapshot;
      reportElement.appendChild(form);

      var testTitle = document.createElement("h1");
      testTitle.innerText = test.name+" ("+test.snapshot+")";
      form.appendChild(testTitle);

      var table = document.createElement("table");
      form.appendChild(table);
      var tableRow = document.createElement("tr");
      table.appendChild(tableRow);
      var tableCell1 = document.createElement("td");
      var tableCell2 = document.createElement("td");
      var tableCell3 = document.createElement("td");
      tableRow.appendChild(tableCell1);
      tableRow.appendChild(tableCell2);
      tableRow.appendChild(tableCell3);

      var caption = document.createElement("h2");
      caption.innerText = "Expected:";
      tableCell1.appendChild(caption);
      var preEl = document.createElement("textarea");
      preEl.value = format(oldStr);
      preEl.name = "text1";
      tableCell1.appendChild(preEl);

      var caption2 = document.createElement("h2");
      caption2.innerText = "Actual:";
      tableCell2.appendChild(caption2);
      var preEl2 = document.createElement("textarea");
      preEl2.value = format(newstr);
      preEl2.name = "text2";
      tableCell2.appendChild(preEl2);

      var caption3 = document.createElement("h2");
      caption3.innerText = "Do:";
      tableCell3.appendChild(caption3);
      var submit = document.createElement("button");
      submit.innerText = "Compare on https://text-compare.com/";
      tableCell3.appendChild(submit);
      tableCell3.appendChild(document.createElement("br"));

      var download = document.createElement("a");
      download.setAttribute("href", "data:text/plain;charset=utf-8," +encodeURIComponent(format(newstr)));
      download.setAttribute("download", test.snapshot+".snap.html");
      download.innerText = "Download snapshot";
      tableCell3.appendChild(download);
    }

    done();
  });
  if (test.initSurvey)
    test.initSurvey(platform.survey);
  platform.render(platform.survey, surveyElement);
}
