/* global Survey, SurveyReact, SurveyTheme, React, ReactDOM, SurveyRichText */
// Dev-only harness for the rich text plugin. Not part of any bundle.
var EXTERNAL_VALUE = "Set externally: **bold** and *italic*";

var demoSurveyJson = String.raw`{
  "title": "Rich text **demo**",
  "description": "Survey description with *italic* text.\n\nSecond paragraph.",
  "pages": [
    {
      "name": "strings",
      "title": "Strings",
      "elements": [
        {
          "type": "text", "name": "s1",
          "title": "Title with *italic*, **bold**, ~~strike~~ and [a link](https://surveyjs.io)",
          "description": "Line one\nLine two\n\n- item one\n- item two"
        },
        {
          "type": "radiogroup", "name": "s2", "title": "Plain title",
          "choices": ["**Bold** choice", "Plain choice", "Choice with a literal \\* star"]
        },
        { "type": "text", "name": "s3", "title": "Raw <b>html</b> and <script>alert(1)</script>" },
        { "type": "text", "name": "s4", "title": "[js link](javascript:alert(1))" },
        { "type": "text", "name": "s5", "title": "Table", "description": "| a | b |\n|---|---|\n| 1 | 2 |" },
        { "type": "text", "name": "s6", "title": "- not a list in a title" },
        {
          "type": "text", "name": "s7", "title": "HTML string",
          "description": "<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>"
        }
      ]
    },
    {
      "name": "editor",
      "title": "Editor",
      "elements": [
        { "type": "comment", "name": "c_md", "title": "Markdown answer", "textFormat": "markdown", "placeholder": "Type and format text" },
        { "type": "comment", "name": "c_typing", "title": "Updates while typing", "textFormat": "markdown", "textUpdateMode": "onTyping" },
        { "type": "comment", "name": "c_html", "title": "HTML answer", "textFormat": "html" },
        { "type": "comment", "name": "c_inline", "title": "Inline mode", "textFormat": "markdown", "acceptCarriageReturn": false },
        { "type": "comment", "name": "c_max", "title": "Max length 50", "textFormat": "markdown", "maxLength": 50 },
        { "type": "comment", "name": "c_rows", "title": "Rows, autoGrow, resize", "textFormat": "markdown", "rows": 6, "autoGrow": true, "allowResize": true },
        {
          "type": "comment", "name": "c_unsupported", "title": "Unsupported stored content", "textFormat": "html",
          "defaultValue": "<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>"
        },
        {
          "type": "matrixdropdown", "name": "m1", "title": "Matrix with a rich comment cell",
          "columns": [{ "name": "notes", "cellType": "comment", "textFormat": "markdown" }],
          "rows": ["Row 1"]
        }
      ]
    }
  ]
}`;

var survey = new Survey.Model(JSON.parse(demoSurveyJson));
window.survey = survey;

var pluginLoaded = typeof SurveyRichText !== "undefined" && !!SurveyRichText.RichText;
document.getElementById("plugin-status").textContent = pluginLoaded ? "Plugin: loaded" : "Plugin: off";

function text(id, value) {
  document.getElementById(id).textContent = value;
}

function refreshLiveData() {
  text("live-data", JSON.stringify(survey.data, null, 2));
}

survey.onValueChanged.add(function (sender, options) {
  var log = document.getElementById("event-log");
  log.textContent += options.name + ": " + JSON.stringify(options.value) + "\n";
  refreshLiveData();
});
refreshLiveData();

function showJson() {
  text("json-out", JSON.stringify(survey.toJSON(), null, 2));
}
document.getElementById("show-json").addEventListener("click", showJson);

document.getElementById("set-value").addEventListener("click", function () {
  survey.setValue("c_md", EXTERNAL_VALUE);
});

document.getElementById("set-value-delayed").addEventListener("click", function () {
  text("delay-status", "Updating c_md in 3 seconds...");
  setTimeout(function () {
    survey.setValue("c_md", EXTERNAL_VALUE);
    text("delay-status", "");
  }, 3000);
});

function setPressed(selector, attr, value) {
  var nodes = document.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].getAttribute(attr) === value) {
      nodes[i].classList.add("is-active");
    } else {
      nodes[i].classList.remove("is-active");
    }
  }
}

function applyMode(mode) {
  survey.setDesignMode(mode === "design");
  survey.mode = mode === "display" ? "display" : "edit";
  survey.readOnly = mode === "readonly";
  setPressed("[data-mode]", "data-mode", mode);
}

var modeButtons = document.querySelectorAll("[data-mode]");
for (var m = 0; m < modeButtons.length; m++) {
  modeButtons[m].addEventListener("click", function () {
    applyMode(this.getAttribute("data-mode"));
  });
}
applyMode("edit");

function applyTheme(name) {
  survey.applyTheme(name === "dark" ? SurveyTheme.DefaultDark : SurveyTheme.DefaultLight);
  setPressed("[data-theme]", "data-theme", name);
}

var themeButtons = document.querySelectorAll("[data-theme]");
for (var t = 0; t < themeButtons.length; t++) {
  themeButtons[t].addEventListener("click", function () {
    applyTheme(this.getAttribute("data-theme"));
  });
}
setPressed("[data-theme]", "data-theme", "light");

var currentStringHandler = null;

function builtinStringHandler(sender, options) {
  SurveyRichText.RichText.textMarkdownHandler(sender, options);
}

function rawHtmlStringHandler(sender, options) {
  options.html = options.text;
}

function customStringHandler(sender, options) {
  var api = SurveyRichText.RichText;
  if (options.name === "title") {
    options.html = "[handler] " + api.markdownToHtml(options.text, { inline: true });
    return;
  }
  var html = api.markdownToHtml(options.text);
  if (html) options.html = html;
}

function applyStringHandler(name) {
  if (currentStringHandler) survey.onTextMarkdown.remove(currentStringHandler);
  currentStringHandler = name === "builtin" ? builtinStringHandler : name === "html" ? rawHtmlStringHandler : name === "custom" ? customStringHandler : null;
  if (currentStringHandler) survey.onTextMarkdown.add(currentStringHandler);
  if (typeof survey.locStrsChanged === "function") survey.locStrsChanged();
  setPressed("[data-handler]", "data-handler", name);
}

if (pluginLoaded) {
  var handlerButtons = document.querySelectorAll("[data-handler]");
  for (var h = 0; h < handlerButtons.length; h++) {
    handlerButtons[h].addEventListener("click", function () {
      applyStringHandler(this.getAttribute("data-handler"));
    });
  }
  applyStringHandler("builtin");
}

function richTextApi() {
  if (!pluginLoaded || !SurveyRichText.RichText) return null;
  return SurveyRichText.RichText;
}

document.getElementById("external-converter").addEventListener("change", function () {
  var api = richTextApi();
  if (!api || typeof api.registerFormat !== "function") {
    this.checked = false;
    text("converter-status", "The external converter sample is not included yet.");
    return;
  }
  text("converter-status", "");
});

function updatePlayground() {
  var api = richTextApi();
  var source = document.getElementById("pg-source").value;
  var format = document.getElementById("pg-format").value;
  if (!api || typeof api.getFormat !== "function") {
    document.getElementById("pg-preview").textContent = "";
    text("pg-canonical", "");
    text("pg-meta", "Converter is not available yet.");
    return;
  }
  var converter = api.getFormat(format);
  var context = { inline: false };
  var html = converter.toHtml(source, context);
  document.getElementById("pg-preview").innerHTML = html;
  var holder = document.createElement("div");
  holder.innerHTML = html;
  var canonical = converter.toSource(holder, context);
  text("pg-canonical", canonical);
  var unsupported = typeof converter.getUnsupported === "function" ? converter.getUnsupported(source) : [];
  var lossless = typeof api.isLossless === "function" ? api.isLossless(source, format, context) : "";
  text("pg-meta", "isLossless: " + lossless + "\ngetUnsupported: " + JSON.stringify(unsupported));
}

document.getElementById("pg-source").addEventListener("input", updatePlayground);
document.getElementById("pg-format").addEventListener("change", updatePlayground);
updatePlayground();

document.getElementById("find-unsupported").addEventListener("click", function () {
  var api = richTextApi();
  if (!api || typeof api.findUnsupported !== "function") {
    text("unsupported-out", "Not available yet.");
    return;
  }
  var found = api.findUnsupported(survey);
  if (!found.length) {
    text("unsupported-out", "(none)");
    return;
  }
  text("unsupported-out", found.map(function (item) {
    var name = item.element && item.element.name ? item.element.name : "";
    return name + " " + item.name + " " + JSON.stringify(item.text);
  }).join("\n"));
});

// The demo page loads React 16, where ReactDOM.render is the supported API.
// eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  React.createElement(SurveyReact.Survey, { model: survey }),
  document.getElementById("surveyElement")
);
