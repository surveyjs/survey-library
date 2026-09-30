// Filter control prototype (#11890) over a real server: the products of the public OData Northwind
// service. The matrix reads them through a data source with readRange, so the filter, the sort and
// the page all run on the server: the filter arrives as a survey expression and is translated into
// $filter here, the way dynamic-data-interfaces.ts describes.
var ODATA = "https://services.odata.org/V4/Northwind/Northwind.svc/";
// Record field -> OData property. The record is flat; Category is a navigation property.
var fieldMap = { name: "ProductName", category: "Category/CategoryName", quantity: "QuantityPerUnit",
  price: "UnitPrice", stock: "UnitsInStock", discontinued: "Discontinued" };
var comparisons = { equal: "eq", notequal: "ne", greater: "gt", less: "lt", greaterorequal: "ge", lessorequal: "le" };

function odataLiteral(value) {
  if (value === null || value === undefined) return "null";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "'" + String(value).replace(/'/g, "''") + "'";
}
function untranslatable(op) {
  throw new Error("No OData for: " + (!!op ? op.toString() : "a missing operand"));
}
// The right side of a comparison must be a value: a field, an arithmetic or a function there reads
// as a value too (its name, or null) and would filter by something nobody asked for.
function constValue(op) {
  if (!op || op.getType() !== "const") untranslatable(op);
  return op.correctValue;
}
function odataField(op) {
  if (op.getType() !== "variable" || !fieldMap[op.variable]) untranslatable(op);
  return fieldMap[op.variable];
}
function constValues(op) {
  return !!op && op.getType() === "array" ? op.values.map(constValue) : [constValue(op)];
}
// Every node the filter control composes has an OData form here; anything else is refused, so a
// filter is never silently narrowed to the part that happened to translate.
function toOData(op) {
  var type = op.getType();
  if (type === "binary") {
    var name = op.operator;
    if (name === "and" || name === "or") {
      return "(" + toOData(op.leftOperand) + " " + name + " " + toOData(op.rightOperand) + ")";
    }
    var field = odataField(op.leftOperand);
    if (comparisons[name]) return field + " " + comparisons[name] + " " + odataLiteral(constValue(op.rightOperand));
    if (name === "contains" || name === "notcontains") {
      // OData contains() is case-sensitive, a survey expression's is not.
      var text = "contains(tolower(" + field + "), " + odataLiteral(String(constValue(op.rightOperand)).toLowerCase()) + ")";
      return name === "contains" ? text : "not " + text;
    }
    if (name === "anyof" || name === "noneof") {
      // Northwind has no "in": a set is a chain of eq.
      var anyOf = "(" + constValues(op.rightOperand).map(function (v) { return field + " eq " + odataLiteral(v); }).join(" or ") + ")";
      return name === "anyof" ? anyOf : "not " + anyOf;
    }
  }
  // The quick search composes a bare "false" when no field can match what was typed.
  if (type === "const" && typeof op.correctValue === "boolean") return String(op.correctValue);
  if (type === "unary") {
    if (op.operator === "empty") return odataField(op.expression) + " eq null";
    if (op.operator === "notempty") return odataField(op.expression) + " ne null";
    if (op.operator === "negate") return "not (" + toOData(op.expression) + ")";
  }
  untranslatable(op);
}
window.filterToOData = function (expression) {
  var operand = new Survey.ConditionsParser().parseExpression(expression);
  if (!operand) throw new Error("Not a survey expression: " + expression);
  return toOData(operand);
};

function toRecord(p) {
  return { id: p.ProductID, name: p.ProductName, category: p.Category ? p.Category.CategoryName : null,
    quantity: p.QuantityPerUnit, price: p.UnitPrice, stock: p.UnitsInStock, discontinued: p.Discontinued };
}
function readJson(url) {
  return fetch(url).then(function (res) {
    if (!res.ok) throw new Error("OData " + res.status + " " + res.statusText);
    return res.json();
  });
}
var productsSource = {
  keyField: "id",
  // Required by the contract; with readRange the list never calls it.
  read: function () {
    return productsSource.readRange({ skip: 0, take: 0, filter: "", sort: [] }).then(function (r) { return r.records; });
  },
  readRange: function (request) {
    try {
      var params = ["$count=true", "$expand=Category($select=CategoryName)",
        "$select=ProductID,ProductName,QuantityPerUnit,UnitPrice,UnitsInStock,Discontinued"];
      if (!!request.filter) {
        params.push("$filter=" + encodeURIComponent(window.filterToOData(request.filter)));
      }
      if (request.sort.length > 0) {
        params.push("$orderby=" + encodeURIComponent(request.sort.map(function (s) { return fieldMap[s.field] + " " + s.direction; }).join(",")));
      }
      if (request.skip > 0) params.push("$skip=" + request.skip);
      if (request.take > 0) params.push("$top=" + request.take);
      var url = ODATA + "Products?" + params.join("&");
      console.log("odata", JSON.stringify(request.filter), "->", decodeURIComponent(url));
      return readJson(url).then(function (data) {
        showDataError("");
        return { total: data["@odata.count"], records: data.value.map(toRecord) };
      });
    } catch (e) {
      // A filter that does not translate is a failed read, reported through onDynamicDataError.
      return Promise.reject(e);
    }
  }
};

// A failed read keeps the previous rows on screen, so without this the new filter would look applied.
function showDataError(message) {
  var el = document.getElementById("dataError");
  if (!el) {
    el = document.createElement("div");
    el.id = "dataError";
    el.style.cssText = "position: fixed; left: 16px; right: 16px; bottom: 16px; z-index: 3000; padding: 8px 12px; " +
      "background: #fde8e8; color: #9b1c1c; border: 1px solid #f8b4b4; border-radius: 4px; font: 14px sans-serif;";
    document.body.appendChild(el);
  }
  el.textContent = !!message ? "The filter was not applied: " + message : "";
  el.style.display = !!message ? "block" : "none";
}

function renderSurvey(categories) {
  var json = { elements: [
    { type: "filter", name: "products-filter", title: "Filter products", source: "products", showSearch: true,
      // Text and choice fields only: a quick search over a number or a boolean would send contains()
      // on a decimal, which OData refuses.
      searchFields: ["name", "category", "quantity"],
      items: [
        { name: "cheap-beverages", title: "Cheap beverages", expression: "{category} = 'Beverages' and {price} < 20" },
        { name: "out-of-stock", title: "Out of stock", expression: "{stock} = 0" },
        { name: "available", title: "Available", expression: "{stock} > 0 and {discontinued} = false" },
        { name: "edges", title: "Cheap or premium (raw)", expression: "{price} < 10 or {price} > 100" },
        { name: "ai", title: "AI: discontinued", type: "ai", prompt: "discontinued products", expression: "{discontinued} = true", allowEdit: false }
      ] },
    { type: "matrixdynamic", name: "products", title: "Products (OData Northwind)", rowsPerPage: 10, columns: [
      { name: "name", title: "Product", cellType: "text" },
      { name: "category", title: "Category", cellType: "dropdown", choices: categories },
      { name: "quantity", title: "Quantity per unit", cellType: "text" },
      { name: "price", title: "Price", cellType: "text", inputType: "number" },
      { name: "stock", title: "In stock", cellType: "text", inputType: "number" },
      { name: "discontinued", title: "Discontinued", cellType: "boolean" }] }
  ] };
  var model = new Survey.Model(json);
  model.getQuestionByName("products").dataSource = productsSource;
  model.onDynamicDataError.add(function (_, options) {
    console.error("data source", options.operation, String(options.error));
    showDataError(String(options.error && options.error.message || options.error));
  });
  model.onFilterChanged.add(function (_, options) { console.log("filter", options.question.name, options.filterExpression); });
  model.onUIStateChanged.add(function () { console.log("uiState", JSON.stringify(model.uiState)); });
  window.survey = model;
  ReactDOM.render(<SurveyReact.Survey model={model} />, document.getElementById("surveyElement"));
}

readJson(ODATA + "Categories?$select=CategoryName").then(function (data) {
  renderSurvey(data.value.map(function (c) { return c.CategoryName; }));
}).catch(function (e) {
  document.getElementById("surveyElement").textContent = "Could not load the Northwind categories: " + e.message;
});
