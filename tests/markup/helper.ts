import { settings } from "../../src/settings";
import { StylesManager } from "../../src/stylesmanager";

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
    test.before({ settings: platform.getSettings ? platform.getSettings() : settings, StylesManager: platform.getStylesManager ? platform.getStylesManager() : StylesManager });
  platform.survey = platform.surveyFactory(test.json);
  platform.survey.textUpdateMode = "onTyping";
  platform.survey[test.event || "onAfterRenderQuestion"].add(function (survey, options) {
    setTimeout(()=>{
      const htmlElement = options.htmlElement;
      var all = htmlElement.getElementsByTagName("*");
      for (var i = 0, max = all.length; i < max; i++) {
        clearAttributes(all[i]);
        clearClasses(all[i]);
      }
      sortAttributes(all);
      const newEl = document.createElement("div");
      newEl.innerHTML = crearExtraElements(htmlElement.innerHTML);
      let str = newEl.children[0].innerHTML;

      var re = /(<!--[\s\S]*?-->)/g;
      var newstr = str.replace(re, "");
      newstr = newstr.replace(/(> +<)/g, "><").trim();
      var etalonFileName = "./snapshots/"+test.snapshot+".snap.html";
      var oldStr = test.etalon || !test.etalon && (!!platform.getStrFromHtml ? platform.getStrFromHtml(etalonFileName) : require(etalonFileName));
      oldStr = oldStr.replace(/(\r\n|\n|\r|\t)/gm, "");
      oldStr = oldStr.replace(/(> +<)/g, "><").trim();

      //temp
      newstr = sortClasses(newstr);
      oldStr = sortClasses(oldStr);

      assert.equal(newstr, oldStr,
        newstr == oldStr ?
          platform.name + " " + test.name + " rendered correctly" :
          platform.name + " " + test.name + " rendered incorrectly, see http://localhost:9876/debug.html#"+test.snapshot);
      if (test.after) { test.after({ settings: platform.getSettings ? platform.getSettings() : settings, StylesManager: platform.getStylesManager ? platform.getStylesManager() : StylesManager }); }
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
    }, 10);
  });
  if (test.initSurvey)
    test.initSurvey(platform.survey);
  platform.render(platform.survey, surveyElement);
}

const removeExtraElementsConditions: Array<(htmlElement: HTMLElement) => boolean> = [
  (htmlElement: HTMLElement) => htmlElement.classList.contains(".sv-vue-title-addional-div"),
  (HTMLElement: HTMLElement) => HTMLElement.tagName.toLowerCase().search(/^sv-ng/) > -1
];

function crearExtraElements(innerHTML: string): string {
  const container = document.createElement("div");
  container.innerHTML = innerHTML;
  container.querySelectorAll("*").forEach((el)=>{
    if(removeExtraElementsConditions.some(condition => condition(<HTMLElement>el))) {
      removeExtraElement(<HTMLElement>el);
    }
  });
  return container.innerHTML;
}

function removeExtraElement(el: HTMLElement) {
  const parentEl = el.parentElement || el;
  let nextSibling:any = el.nextSibling;
  el.remove();
  while (el.children.length > 0) {
    const childEl = el.children[el.children.length - 1];
    parentEl.insertBefore(el.children[el.children.length - 1], nextSibling);
    nextSibling = childEl;
  }
}

function clearClasses(el: Element) {
  let classesToRemove: Array<string> = [];
  if(el.className !== "") {
    el.classList.forEach((className: string) => {
      if(className.search(/^ng-/) > -1) {
        classesToRemove.push(className);
      }
    });
    el.classList.remove(...classesToRemove);
    if(el.className === "") {
      el.removeAttribute("class");
    }
  }
}

function clearAttributes(el: Element) {
  el.removeAttribute("aria-labelledby");
  el.removeAttribute("data-bind");
  el.removeAttribute("data-key");
  el.removeAttribute("data-rendered");
  el.removeAttribute("id");
  el.removeAttribute("for");
  if(el.getAttribute("list")) el.removeAttribute("list");
  el.removeAttribute("fragment");
  if(el.getAttribute("name") !== "name")
    el.removeAttribute("name");
  if((<any>el).checked) {
    el.setAttribute("checked", "");
  }
  if((<any>el).multiple) {
    el.setAttribute("multiple", "");
  }
  if(el.hasAttribute("readonly"))
    el.setAttribute("readonly", "");
  if(el.hasAttribute("ng-reflect-value")) {
    el.setAttribute("value", <string>el.getAttribute("ng-reflect-value"));
  }
  const attributesToRemove = [];
  for (let i = 0; i < el.attributes.length; i ++) {
    const attr = el.attributes[i];
    if (attr.name.search(/^(_ng|ng-|sv-ng)/) > -1) {
      attributesToRemove.push(el.attributes[i].name);
    }
  }
  attributesToRemove.forEach((attr) => {
    el.removeAttribute(attr);
  });
}

function sortClasses(str: string) {
  const div = document.createElement("div");
  div.innerHTML = str;
  div.querySelectorAll("*").forEach(el => {
    if(el.className !== "") {
      const classList = el.classList.value.replace(/\s+/, " ").split(" ");
      el.classList.value = classList.sort((a: string, b: string) => a.localeCompare(b)).join(" ");
    }
  });
  return div.innerHTML;
}