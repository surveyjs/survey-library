import { IExpressionValidationResult } from "../../src/base";
import { ExpressionErrorType } from "../../src/conditions";
import { SurveyModel } from "../../src/survey";

export default QUnit.module("Expression Validation");

function convertIExpressionErrors(errors: IExpressionValidationResult[]): (IExpressionValidationResult & { name: string })[] {
  return errors.map(error => ({ ...error, name: (<any>error.obj).name }));
}

QUnit.test("Test validateExpression in Object", (assert) => {

  var survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        visibleIf: "asyncFunc1({q2}) = 2",
        enableIf: "{q1} = 1",
        requiredIf: "bd+{",
        resetValueIf: "foo",
      },
    ],
  });

  const q1 = survey.getQuestionByName("q1");

  let result = q1.validateExpression("enableIf", q1.enableIf, { functions: false, variables: false, semantics: false });
  assert.equal(result, undefined, "There is no error - valid expression");

  result = q1.validateExpression("visibleIf", q1.visibleIf, { functions: false, variables: false, semantics: false });
  assert.equal(result, undefined, "There is no error due to disabled checks");

  result = q1.validateExpression("visibleIf", q1.visibleIf, { functions: true, variables: false, semantics: false });
  assert.notEqual(result, undefined, "There is an error");
  assert.equal(result.errors.length, 1, "There is 1 error");
  assert.equal(result.errors[0].errorType, ExpressionErrorType.UnknownFunction, "Error type is 'UnknownFunction'");

  result = q1.validateExpression("visibleIf", q1.visibleIf, { functions: false, variables: true, semantics: false });
  assert.notEqual(result, undefined, "There is an error");
  assert.equal(result.errors.length, 1, "There is 1 error");
  assert.equal(result.errors[0].errorType, ExpressionErrorType.UnknownVariable, "Error type is 'UnknownVariable'");

  result = q1.validateExpression("visibleIf", q1.visibleIf, { functions: true, variables: true, semantics: false });
  assert.notEqual(result, undefined, "There is an error");
  assert.equal(result.errors.length, 2, "There is 2 errors");

  result = q1.validateExpression("requiredIf", q1.requiredIf, { functions: true, variables: true, semantics: false });
  assert.notEqual(result, undefined, "There is an error");
  assert.equal(result.errors[0].errorType, ExpressionErrorType.SyntaxError, "Error type is 'SyntaxError'");

  result = q1.validateExpression("resetValueIf", q1.resetValueIf, { functions: true, variables: true, semantics: false });
  assert.equal(result, undefined, "There is no error - due to disabled semantics check");

  result = q1.validateExpression("resetValueIf", q1.resetValueIf, { functions: true, variables: true, semantics: true });
  assert.notEqual(result, undefined, "There is an error");
  assert.equal(result.errors[0].errorType, ExpressionErrorType.SemanticError, "Error type is 'SemanticError'");
});

QUnit.test("Test validateExpressions in Object", (assert) => {

  var survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        visibleIf: "asyncFunc1({q2}) = 2",
        enableIf: "{q1} = 1",
        requiredIf: "bd+{",
      },
    ],
  });

  const q1 = survey.getQuestionByName("q1");
  let result = convertIExpressionErrors(q1.validateExpressions({ functions: true, variables: true, semantics: true }));

  assert.equal(result.length, 2, "There are 2 invalid expressions");
  assert.equal(result[0].propertyName, "visibleIf", "First error is for 'visibleIf'");
  assert.equal(result[0].name, "q1", "First filed name for error is 'q1'");
  assert.equal(result[0].errors.length, 2, "There is 2 errors for 'visibleIf'");

  assert.equal(result[1].propertyName, "requiredIf", "Second error is for 'requiredIf'");
  assert.equal(result[1].name, "q1", "Second filed name for error is 'q1'");
  assert.equal(result[1].errors.length, 1, "There is 1 error for 'requiredIf'");
});

QUnit.test("Test validateExpressions in Object including childre", (assert) => {

  var survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        visibleIf: "asyncFunc1({q2}) = 2",
        enableIf: "{q1} = 1",
        requiredIf: "bd+{",
      },
    ],
  });

  let result = convertIExpressionErrors(survey.validateExpressions({ functions: true, variables: true, semantics: true }));

  assert.equal(result.length, 2, "There are 2 invalid expressions");
  assert.equal(result[0].propertyName, "visibleIf", "First error is for 'visibleIf'");
  assert.equal(result[0].name, "q1", "First filed name for error is 'q1'");
  assert.equal(result[0].errors.length, 2, "There is 2 errors for 'visibleIf'");

  assert.equal(result[1].propertyName, "requiredIf", "Second error is for 'requiredIf'");
  assert.equal(result[1].name, "q1", "Second filed name for error is 'q1'");
  assert.equal(result[1].errors.length, 1, "There is 1 error for 'requiredIf'");
});

QUnit.test("Test validateExpressions with Survey + expressions", (assert) => {

  var survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        validators: [
          { type: "expression", expression: "bs+{" },
        ]
      },
    ],
    calculatedValues: [
      { name: "calc1", expression: "bs+{" },
    ],
    triggers: [
      { type: "runexpression", expression: "bs+{", runExpression: "bs+{" }
    ],
    navigateToUrlOnCondition: [
      { expression: "bs+{" }
    ],
  });

  let result = convertIExpressionErrors(survey.validateExpressions({ functions: true, variables: true, semantics: true }));
  assert.equal(result.length, 5, "There are 5 invalid expressions");

  assert.deepEqual(
    result.map(e => e.obj.getType()),
    ["expressionvalidator", "calculatedvalue", "runexpressiontrigger", "runexpressiontrigger", "urlconditionitem"],
    "object types"
  );

  assert.deepEqual(
    result.map(e => e.propertyName),
    ["expression", "expression", "expression", "runExpression", "expression"],
    "propertyNames"
  );

  assert.deepEqual(
    result.map(e => e.errors.length),
    [1, 1, 1, 1, 1],
    "Number of errors"
  );
});

QUnit.test("Test validateExpressions selectbase", (assert) => {

  var survey = new SurveyModel({
    elements: [
      {
        type: "dropdown",
        name: "question1",
        visibleIf: "bs+{",
        enableIf: "bs+{",
        resetValueIf: "bs+{",
        setValueIf: "bs+{",
        setValueExpression: "bs+{",
        defaultValueExpression: "bs+{",
        requiredIf: "bs+{",
        choices: [
          { value: "Item 1", visibleIf: "bs+{", enableIf: "bs+{" },
        ],
        choicesVisibleIf: "bs+{",
        choicesEnableIf: "bs+{"
      }
    ],
  });

  let result = survey.validateExpressions({ functions: true, variables: true, semantics: true });

  assert.equal(result.length, 11, "There are 11 invalid expressions");
  assert.deepEqual(
    result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]),
    [
      ["dropdown", "visibleIf", 1],
      ["dropdown", "enableIf", 1],
      ["dropdown", "resetValueIf", 1],
      ["dropdown", "setValueIf", 1],
      ["dropdown", "setValueExpression", 1],
      ["dropdown", "defaultValueExpression", 1],
      ["dropdown", "requiredIf", 1],
      ["dropdown", "choicesVisibleIf", 1],
      ["dropdown", "choicesEnableIf", 1],
      ["choiceitem", "visibleIf", 1],
      ["choiceitem", "enableIf", 1]
    ],
    "obj + property + count"
  );

});

QUnit.test("Test validateExpressions matrix", (assert) => {

  var survey = new SurveyModel({
    elements: [
      {
        type: "matrix",
        name: "question1",
        validators: [
          {
            type: "expression",
            expression: "bs+{"
          }
        ],
        columns: [
          {
            value: "Column 1",
            visibleIf: "bs+{",
            enableIf: "bs+{"
          },
        ],
        rows: [
          {
            value: "Row 1",
            visibleIf: "bs+{",
            enableIf: "bs+{"
          },
        ]
      }
    ],
  });

  let result = survey.validateExpressions({ functions: true, variables: true, semantics: true });

  assert.equal(result.length, 5, "There are 5 invalid expressions");
  assert.deepEqual(
    result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]),
    [
      ["expressionvalidator", "expression", 1],
      ["matrixcolumn", "visibleIf", 1],
      ["matrixcolumn", "enableIf", 1],
      ["itemvalue", "visibleIf", 1],
      ["itemvalue", "enableIf", 1]
    ],
    "obj + property + count"
  );
});

QUnit.test("Test validateExpressions matrixdropdown", (assert) => {

  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "question2",
        columns: [
          {
            name: "Column 1",
            visibleIf: "1col-bs+{",
            enableIf: "2col-bs+{",
            requiredIf: "3col-bs+{",
            resetValueIf: "4col-bs+{",
            setValueIf: "5col-bs+{",
            setValueExpression: "6col-bs+{",
            totalExpression: "7col-bs+{",
            defaultValueExpression: "8col-bs+{",
            validators: [
              {
                type: "expression",
                expression: "11val-bs+{"
              }
            ],
          }
        ],
        detailElements: [
          {
            type: "text",
            name: "question2",
            visibleIf: "bs+{",
            enableIf: "bs+{",
            resetValueIf: "bs+{",
            setValueIf: "bs+{",
            setValueExpression: "bs+{",
            defaultValueExpression: "bs+{",
            requiredIf: "bs+{"
          }
        ],
        rows: [
          {
            value: "Row 1",
            visibleIf: "9row-bs+{",
            enableIf: "10row-bs+{"
          }
        ]
      }
    ],
  });

  let result = survey.validateExpressions({ functions: true, variables: true, semantics: true });

  assert.equal(result.length, 18, "There are 18 invalid expressions");
  assert.deepEqual(
    result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]),
    [
      ["text", "visibleIf", 1],
      ["text", "enableIf", 1],
      ["text", "resetValueIf", 1],
      ["text", "setValueIf", 1],
      ["text", "setValueExpression", 1],
      ["text", "defaultValueExpression", 1],
      ["text", "requiredIf", 1],
      ["matrixdropdowncolumn", "visibleIf", 1],
      ["matrixdropdowncolumn", "enableIf", 1],
      ["matrixdropdowncolumn", "requiredIf", 1],
      ["matrixdropdowncolumn", "resetValueIf", 1],
      ["matrixdropdowncolumn", "setValueIf", 1],
      ["matrixdropdowncolumn", "setValueExpression", 1],
      ["matrixdropdowncolumn", "totalExpression", 1],
      ["matrixdropdowncolumn", "defaultValueExpression", 1],
      ["expressionvalidator", "expression", 1],
      ["itemvalue", "visibleIf", 1],
      ["itemvalue", "enableIf", 1]
    ],
    "obj + property + count"
  );
});

QUnit.test("Test validateExpressions matrixdynamic", (assert) => {

  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "question1",
        columns: [
          {
            name: "Column 1",
            visibleIf: "bs+{",
            enableIf: "bs+{",
            requiredIf: "bs+{",
            resetValueIf: "bs+{",
            setValueIf: "bs+{",
            setValueExpression: "bs+{",
            totalExpression: "bs+{",
            defaultValueExpression: "bs+{"
          }
        ],
        choices: [
          {
            value: 1,
            visibleIf: "bs+{",
            enableIf: "bs+{"
          }
        ]
      }
    ],
  });

  let result = survey.validateExpressions({ functions: true, variables: true, semantics: true });

  assert.equal(result.length, 10, "There are 10 invalid expressions");
  assert.deepEqual(
    result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]),
    [
      ["matrixdropdowncolumn", "visibleIf", 1],
      ["matrixdropdowncolumn", "enableIf", 1],
      ["matrixdropdowncolumn", "requiredIf", 1],
      ["matrixdropdowncolumn", "resetValueIf", 1],
      ["matrixdropdowncolumn", "setValueIf", 1],
      ["matrixdropdowncolumn", "setValueExpression", 1],
      ["matrixdropdowncolumn", "totalExpression", 1],
      ["matrixdropdowncolumn", "defaultValueExpression", 1],
      ["itemvalue", "visibleIf", 1],
      ["itemvalue", "enableIf", 1]
    ],
    "obj + property + count"
  );
});

QUnit.test("Test validateExpressions paneldynamic", (assert) => {

  var survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic",
        name: "question1",
        templateElements: [
          {
            type: "text",
            name: "question2",
            visibleIf: "bs+{",
            enableIf: "bs+{",
            resetValueIf: "bs+{",
            setValueIf: "bs+{",
            setValueExpression: "bs+{",
            defaultValueExpression: "bs+{",
            requiredIf: "bs+{"
          }
        ]
      }
    ],
  });

  let result = survey.validateExpressions({ functions: true, variables: true, semantics: true });

  assert.equal(result.length, 7, "There are 7 invalid expressions");
  assert.deepEqual(
    result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]),
    [
      ["text", "visibleIf", 1],
      ["text", "enableIf", 1],
      ["text", "resetValueIf", 1],
      ["text", "setValueIf", 1],
      ["text", "setValueExpression", 1],
      ["text", "defaultValueExpression", 1],
      ["text", "requiredIf", 1]
    ],
    "obj + property + count"
  );
});

QUnit.test("Test validateExpressions rating", (assert) => {

  var survey = new SurveyModel({
    elements: [
      {
        type: "rating",
        name: "question1",
        autoGenerate: false,
        rateCount: 1,
        rateValues: [
          {
            value: 1,
            visibleIf: "bs+{"
          }
        ]
      }
    ],
  });

  let result = survey.validateExpressions({ functions: true, variables: true, semantics: true });

  assert.equal(result.length, 1, "There are 1 invalid expressions");
  assert.deepEqual(
    result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]),
    [
      ["ratingitem", "visibleIf", 1]
    ],
    "obj + property + count"
  );
});

QUnit.test("Test validateExpressions panel", (assert) => {

  var survey = new SurveyModel({
    elements: [
      {
        type: "panel",
        name: "panel1",
        elements: [
          {
            type: "text",
            name: "question1",
            visibleIf: "bs+{",
            enableIf: "bs+{",
            resetValueIf: "bs+{",
            setValueIf: "bs+{",
            setValueExpression: "bs+{",
            defaultValueExpression: "bs+{",
            requiredIf: "bs+{"
          }
        ]
      }
    ],
  });

  let result = survey.validateExpressions({ functions: true, variables: true, semantics: true });

  assert.equal(result.length, 7, "There are 7 invalid expressions");
  assert.deepEqual(
    result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]),
    [
      ["text", "visibleIf", 1],
      ["text", "enableIf", 1],
      ["text", "resetValueIf", 1],
      ["text", "setValueIf", 1],
      ["text", "setValueExpression", 1],
      ["text", "defaultValueExpression", 1],
      ["text", "requiredIf", 1]
    ],
    "obj + property + count"
  );
});

QUnit.test("Test validateExpressions tagbox", (assert) => {

  var survey = new SurveyModel({
    elements: [
      {
        type: "tagbox",
        name: "question1",
        choices: [
          {
            value: "Item 1",
            visibleIf: "bs+{",
            enableIf: "bs+{"
          }
        ]
      }
    ],
  });

  let result = survey.validateExpressions({ functions: true, variables: true, semantics: true });

  assert.equal(result.length, 2, "There are 2 invalid expressions");
  assert.deepEqual(
    result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]),
    [
      ["checkboxitem", "visibleIf", 1],
      ["checkboxitem", "enableIf", 1]
    ],
    "obj + property + count"
  );
});

QUnit.test("Test validateExpressions multipletext", (assert) => {

  var survey = new SurveyModel({
    elements: [
      {
        type: "multipletext",
        name: "question2",
        items: [
          {
            name: "text1",
            inputSize: 0,
            validators: [
              {
                type: "expression",
                expression: "bs+{"
              }
            ]
          }
        ]
      }
    ],
  });

  let result = survey.validateExpressions({ functions: true, variables: true, semantics: true });

  assert.equal(result.length, 1, "There are 1 invalid expressions");
  assert.deepEqual(
    result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]),
    [
      ["expressionvalidator", "expression", 1]
    ],
    "obj + property + count"
  );
});

QUnit.test("Test validateExpressions imagemap", (assert) => {

  var survey = new SurveyModel({
    elements: [
      {
        type: "imagemap",
        name: "question2",
        areas: [
          {
            name: "text1",
            visibleIf: "bs+{",
            enableIf: "bs+{",
          }
        ]
      }
    ],
  });

  let result = survey.validateExpressions({ functions: true, variables: true, semantics: true });

  assert.equal(result.length, 2, "There are 2 invalid expressions");
  assert.deepEqual(
    result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]),
    [
      ["imagemaparea", "visibleIf", 1],
      ["imagemaparea", "enableIf", 1]
    ],
    "obj + property + count"
  );
});

QUnit.test("Test validateExpressions check constant in condition error", (assert) => {

  var survey = new SurveyModel({
    elements: [
      { type: "boolean", name: "q1" },
      {
        type: "text",
        name: "q2",
        visibleIf: "{q1} = true",
        enableIf: "foo",
        requiredIf: "true"
      },
      {
        type: "text",
        name: "q2",
        visibleIf: "{q1} = TrUe",
        enableIf: "12345",
        requiredIf: "tRuE"
      }
    ],
  });

  let result = survey.validateExpressions({ functions: true, variables: true, semantics: true });

  assert.equal(result.length, 2, "There are 2 invalid expressions");
  assert.deepEqual(
    result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]),
    [
      ["text", "enableIf", 1],
      ["text", "enableIf", 1]
    ],
    "obj + property + count"
  );

  assert.equal(result[0].errors[0].errorType, ExpressionErrorType.SemanticError, "error type is SemanticError");
  assert.equal(result[1].errors[0].errorType, ExpressionErrorType.SemanticError, "error type is SemanticError #2");
});