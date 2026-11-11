var workedExample = "Please <strong>read</strong> the <em>terms</em> carefully";

var json = {
  title: "Rich text <strong>demo</strong>",
  description: "<p>Survey description with <em>italic</em> text.</p><p>Second paragraph.</p>",
  pages: [
    {
      name: "strings",
      title: "Strings",
      elements: [
        {
          type: "text", name: "s1",
          title: "Title with <em>italic</em>, <strong>bold</strong>, <s>strike</s> and <a href=\"https://surveyjs.io\">a link</a>",
          description: "<p>Line one<br>Line two</p><ul><li>item one</li><li>item two</li></ul>"
        },
        {
          type: "radiogroup", name: "s2", title: "Plain title",
          choices: ["<strong>Bold</strong> choice", "Plain choice", "Markdown **is not** rendered", "Tom & Jerry"]
        },
        { type: "text", name: "s3", title: "Raw <b>html</b> and <script>alert(1)</script>" },
        { type: "text", name: "s4", title: "<a href=\"javascript:alert(1)\">js link</a>" },
        { type: "text", name: "s5", title: "Table", description: "<table><tr><td>a</td><td>b</td></tr><tr><td>1</td><td>2</td></tr></table>" },
        { type: "text", name: "s6", title: "<ul><li>a list</li><li>in a title</li></ul>" },
        {
          type: "text", name: "s7", title: "Styled string",
          description: "<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>"
        },
        { type: "text", name: "s8", title: "Plain multi-line description", description: "Plain line one\nPlain line two" }
      ]
    },
    {
      name: "editor",
      title: "Editor",
      elements: [
        { type: "comment", name: "c_md", title: "Rich answer", allowRichText: true, placeholder: "Type and format text" },
        { type: "comment", name: "c_typing", title: "Updates while typing", allowRichText: true, textUpdateMode: "onTyping" },
        {
          type: "comment", name: "c_legacy", title: "Plain answer from before rich text", allowRichText: true,
          defaultValue: "Typed in a textarea: a < b & c\nSecond line"
        },
        { type: "comment", name: "c_inline", title: "Inline mode", allowRichText: true, acceptCarriageReturn: false },
        { type: "comment", name: "c_max", title: "Max length 50", allowRichText: true, maxLength: 50 },
        { type: "comment", name: "c_rows", title: "Rows, autoGrow, resize", allowRichText: true, rows: 6, autoGrow: true, allowResize: true },
        { type: "comment", name: "c_tb_none", title: "Toolbar: none (shortcuts only)", allowRichText: true, richTextToolbarMode: "none" },
        { type: "comment", name: "c_tb_selection", title: "Toolbar: on selection", allowRichText: true, richTextToolbarMode: "onSelection" },
        { type: "comment", name: "c_tb_static", title: "Toolbar: static", allowRichText: true, richTextToolbarMode: "static" },
        {
          type: "comment", name: "c_unsupported", title: "Unsupported stored content", allowRichText: true,
          defaultValue: "<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>"
        },
        {
          type: "matrixdropdown", name: "m1", title: "Matrix with a rich comment cell",
          columns: [{ name: "notes", cellType: "comment", allowRichText: true }],
          rows: ["Row 1"]
        }
      ]
    }
  ]
};

var survey = new Survey.Model(json);
window.survey = survey;

var stringHandler = null;

function richTextApi() {
  return window.SurveyRichText && window.SurveyRichText.RichText;
}

function refreshData() {
  document.getElementById("liveData").textContent = JSON.stringify(survey.data, null, 2);
}

function applyMode(mode) {
  if (mode === "design") {
    survey.mode = "edit";
    survey.setDesignMode(true);
    return;
  }
  survey.setDesignMode(false);
  if (mode === "edit") {
    survey.mode = "edit";
    return;
  }
  survey.mode = "display";
  survey.readOnlyMode = mode === "read-only" ? "readonly" : "view";
}

function applyTheme(name) {
  var theme = name === "dark" ? SurveyTheme.DefaultDark : SurveyTheme.DefaultLight;
  survey.applyTheme(theme);
}

function applyStringHandler(name) {
  if (stringHandler) {
    survey.onTextMarkdown.remove(stringHandler);
    stringHandler = null;
  }
  var api = richTextApi();
  if (name === "built-in" && api && api.renderStringHandler) {
    stringHandler = api.renderStringHandler;
  } else if (name === "raw") {
    stringHandler = function (sender, options) {
      options.html = options.text;
    };
  } else if (name === "custom" && api && api.sanitizeHtml && api.renderStringHandler) {
    stringHandler = function (sender, options) {
      if (options.name === "title") options.html = "[handler] " + api.sanitizeHtml(options.text, { inline: true });
      else api.renderStringHandler(sender, options);
    };
  }
  if (stringHandler) survey.onTextMarkdown.add(stringHandler);
  survey.locStrsChanged();
}

function updatePlayground() {
  var api = richTextApi();
  var source = document.getElementById("playgroundInput").value;
  var block = document.getElementById("playgroundBlock");
  var inline = document.getElementById("playgroundInline");
  var disallowed = document.getElementById("playgroundDisallowed");
  if (!api || !api.sanitizeHtml) {
    block.textContent = "";
    inline.textContent = "";
    disallowed.textContent = "";
    return;
  }
  block.textContent = api.sanitizeHtml(source);
  inline.textContent = api.sanitizeHtml(source, { inline: true });
  disallowed.textContent = api.getDisallowedHtml ? JSON.stringify(api.getDisallowedHtml(source)) : "";
}

if (window.__richTextPlugin) document.body.classList.add("plugin-on");

survey.onValueChanged.add(function (sender, options) {
  var log = document.getElementById("valueLog");
  log.textContent += options.name + " = " + JSON.stringify(options.value) + "\n";
  refreshData();
});
refreshData();

document.getElementById("showJson").addEventListener("click", function () {
  document.getElementById("jsonOutput").textContent = JSON.stringify(survey.toJSON(), null, 2);
});
document.getElementById("setValue").addEventListener("click", function () {
  survey.setValue("c_md", workedExample);
  refreshData();
});
document.getElementById("setValueLater").addEventListener("click", function () {
  window.setTimeout(function () {
    survey.setValue("c_md", workedExample);
    refreshData();
  }, 3000);
});
document.getElementById("modeSwitch").addEventListener("change", function (event) {
  applyMode(event.target.value);
});
document.getElementById("themeSwitch").addEventListener("change", function (event) {
  applyTheme(event.target.value);
});
var handlerSwitch = document.getElementById("handlerSwitch");
if (handlerSwitch) {
  handlerSwitch.addEventListener("change", function (event) {
    applyStringHandler(event.target.value);
  });
  if (window.__richTextPlugin) applyStringHandler(handlerSwitch.value);
}
var playgroundInput = document.getElementById("playgroundInput");
if (playgroundInput) {
  playgroundInput.addEventListener("input", updatePlayground);
  updatePlayground();
}
var findUnsupported = document.getElementById("findUnsupported");
if (findUnsupported) {
  findUnsupported.addEventListener("click", function () {
    var api = richTextApi();
    var output = document.getElementById("unsupportedOutput");
    if (!api || !api.findUnsupported) {
      output.textContent = "";
      return;
    }
    output.textContent = JSON.stringify(api.findUnsupported(survey).map(function (item) {
      return { name: item.element && item.element.name, property: item.name, locale: item.locale };
    }), null, 2);
  });
}

ReactDOM.render(
  React.createElement(SurveyReact.Survey, { model: survey }),
  document.getElementById("surveyElement")
);
