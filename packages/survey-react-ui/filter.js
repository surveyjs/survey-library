// Filter control prototype (#11890): one control bound to a matrix, one standalone in single mode.
var statuses = [{ value: "open", text: "Open" }, { value: "closed", text: "Closed" }, { value: "hold", text: "On hold" }];
var rows = [];
for (var i = 0; i < 40; i++) {
  rows.push({ id: i + 1, name: "Order " + (i + 1), status: statuses[i % 3].value, amount: (i * 37) % 500, urgent: i % 4 === 0 });
}
var json = {
  elements: [
    { type: "filter", name: "orders-filter", title: "Filter orders", source: "orders", showSearch: true,
      items: [
        { name: "open", title: "Open", expression: "{status} = 'open'" },
        { name: "big", title: "Big open", expression: "{status} = 'open' and {amount} > 300" },
        { name: "edges", title: "Small or big (raw)", expression: "{amount} < 50 or {amount} > 450" },
        { name: "ai", title: "AI: urgent", type: "ai", prompt: "urgent orders", expression: "{urgent} = true", allowEdit: false }
      ] },
    { type: "matrixdynamic", name: "orders", title: "Orders", readOnly: true, rowCount: 0, columns: [
      { name: "name", cellType: "text" },
      { name: "status", cellType: "dropdown", choices: statuses },
      { name: "amount", cellType: "text", inputType: "number" },
      { name: "urgent", cellType: "boolean" }] },
    { type: "filter", name: "single", title: "Standalone, single mode", allowMultipleItems: false,
      fields: [{ name: "age", fieldType: "text", inputType: "number" }, { name: "country", fieldType: "dropdown",
        choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }] }],
      items: [{ name: "adults", expression: "{age} > 18" }] }
  ]
};
var model = new Survey.Model(json);
model.setValue("orders", rows);
model.onFilterChanged.add(function (_, options) { console.log("filter", options.question.name, options.filterExpression); });
model.onUIStateChanged.add(function () { console.log("uiState", JSON.stringify(model.uiState)); });
window.survey = model;
ReactDOM.render(<SurveyReact.Survey model={model} />, document.getElementById("surveyElement"));
