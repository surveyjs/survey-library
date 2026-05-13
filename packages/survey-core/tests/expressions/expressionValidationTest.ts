import { IExpressionValidationResult } from "../../src/base";
import { ExpressionErrorType } from "../../src/expressions/expressionError";
import { SurveyModel } from "../../src/survey";

import { describe, test, expect } from "vitest";
describe("Expression Validation", () => {
  function convertIExpressionErrors(errors: IExpressionValidationResult[]): (IExpressionValidationResult & { name: string })[] {
    return errors.map(error => ({ ...error, name: (<any>error.obj).name }));
  }

  test("Test validateExpression in Object", () => {

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
    expect(result, "There is no error - valid expression").toBeUndefined();

    result = q1.validateExpression("visibleIf", q1.visibleIf, { functions: false, variables: false, semantics: false });
    expect(result, "There is no error due to disabled checks").toBeUndefined();

    result = q1.validateExpression("visibleIf", q1.visibleIf, { functions: true, variables: false, semantics: false });
    expect(result, "There is an error").not.toBeUndefined();
    expect(result.errors.length, "There is 1 error").toBe(1);
    expect(result.errors[0].errorType, "Error type is 'UnknownFunction'").toBe(ExpressionErrorType.UnknownFunction);

    result = q1.validateExpression("visibleIf", q1.visibleIf, { functions: false, variables: true, semantics: false });
    expect(result, "There is an error").not.toBeUndefined();
    expect(result.errors.length, "There is 1 error").toBe(1);
    expect(result.errors[0].errorType, "Error type is 'UnknownVariable'").toBe(ExpressionErrorType.UnknownVariable);

    result = q1.validateExpression("visibleIf", q1.visibleIf, { functions: true, variables: true, semantics: false });
    expect(result, "There is an error").not.toBeUndefined();
    expect(result.errors.length, "There is 2 errors").toBe(2);

    result = q1.validateExpression("requiredIf", q1.requiredIf, { functions: true, variables: true, semantics: false });
    expect(result, "There is an error").not.toBeUndefined();
    expect(result.errors[0].errorType, "Error type is 'SyntaxError'").toBe(ExpressionErrorType.SyntaxError);

    result = q1.validateExpression("resetValueIf", q1.resetValueIf, { functions: true, variables: true, semantics: false });
    expect(result, "There is no error - due to disabled semantics check").toBeUndefined();

    result = q1.validateExpression("resetValueIf", q1.resetValueIf, { functions: true, variables: true, semantics: true });
    expect(result, "There is an error").not.toBeUndefined();
    expect(result.errors[0].errorType, "Error type is 'SemanticError'").toBe(ExpressionErrorType.SemanticError);
  });

  test("Test validateExpressions in Object", () => {

    var survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          visibleIf: "asyncFunc1({q2}) = 2",
          enableIf: "{q1} = 1",
          requiredIf: "bd+{",
          resetValueIf: "foo"
        },
      ],
    });

    const q1 = survey.getQuestionByName("q1");
    let result = convertIExpressionErrors(q1.validateExpressions({ functions: true, variables: true, semantics: true }));

    expect(result.length, "There are 3 invalid expressions").toBe(3);
    expect(result.map(e => [
      e.propertyName,
      e.errors.length,
      e.errors.map(er => er.errorType)
    ]), "property + count + [...types]").toEqual([
      ["visibleIf", 2, [ExpressionErrorType.UnknownFunction, ExpressionErrorType.UnknownVariable]],
      ["resetValueIf", 1, [ExpressionErrorType.SemanticError]],
      ["requiredIf", 1, [ExpressionErrorType.SyntaxError]]
    ]);

    result = convertIExpressionErrors(q1.validateExpressions());
    expect(result.length, "There are 3 invalid expressions with default options").toBe(3);
    expect(result.map(e => [
      e.propertyName,
      e.errors.length,
      e.errors.map(er => er.errorType)
    ]), "property + count + [...types]").toEqual([
      ["visibleIf", 2, [ExpressionErrorType.UnknownFunction, ExpressionErrorType.UnknownVariable]],
      ["resetValueIf", 1, [ExpressionErrorType.SemanticError]],
      ["requiredIf", 1, [ExpressionErrorType.SyntaxError]]
    ]);

    result = convertIExpressionErrors(q1.validateExpressions({ functions: false, variables: false, semantics: false }));
    expect(result.length, "There are 1 invalid expressions - only syntax errors are checked").toBe(1);
    expect(result[0].errors[0].errorType, "Only syntax error is checked").toBe(ExpressionErrorType.SyntaxError);
  });

  test("Test validateExpressions in Object including children", () => {

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

    expect(result.length, "There are 2 invalid expressions").toBe(2);
    expect(result[0].propertyName, "First error is for 'visibleIf'").toBe("visibleIf");
    expect(result[0].name, "First filed name for error is 'q1'").toBe("q1");
    expect(result[0].errors.length, "There is 2 errors for 'visibleIf'").toBe(2);

    expect(result[1].propertyName, "Second error is for 'requiredIf'").toBe("requiredIf");
    expect(result[1].name, "Second filed name for error is 'q1'").toBe("q1");
    expect(result[1].errors.length, "There is 1 error for 'requiredIf'").toBe(1);
  });

  test("Test validateExpressions with Survey + expressions", () => {

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
    expect(result.length, "There are 5 invalid expressions").toBe(5);

    expect(result.map(e => e.obj.getType()), "object types").toEqual(["expressionvalidator", "calculatedvalue", "runexpressiontrigger", "runexpressiontrigger", "urlconditionitem"]);

    expect(result.map(e => e.propertyName), "propertyNames").toEqual(["expression", "expression", "expression", "runExpression", "expression"]);

    expect(result.map(e => e.errors.length), "Number of errors").toEqual([1, 1, 1, 1, 1]);
  });

  test("Test validateExpressions selectbase", () => {

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

    expect(result.length, "There are 11 invalid expressions").toBe(11);
    expect(result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]), "obj + property + count").toEqual([
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
    ]);

  });

  test("Test validateExpressions matrix", () => {

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

    expect(result.length, "There are 5 invalid expressions").toBe(5);
    expect(result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]), "obj + property + count").toEqual([
      ["expressionvalidator", "expression", 1],
      ["matrixcolumn", "visibleIf", 1],
      ["matrixcolumn", "enableIf", 1],
      ["itemvalue", "visibleIf", 1],
      ["itemvalue", "enableIf", 1]
    ]);
  });

  test("Test validateExpressions matrixdropdown", () => {

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

    expect(result.length, "There are 18 invalid expressions").toBe(18);
    expect(result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]), "obj + property + count").toEqual([
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
    ]);
  });

  test("Test validateExpressions matrixdynamic", () => {

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

    expect(result.length, "There are 10 invalid expressions").toBe(10);
    expect(result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]), "obj + property + count").toEqual([
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
    ]);
  });

  test("Test validateExpressions paneldynamic", () => {

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

    expect(result.length, "There are 7 invalid expressions").toBe(7);
    expect(result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]), "obj + property + count").toEqual([
      ["text", "visibleIf", 1],
      ["text", "enableIf", 1],
      ["text", "resetValueIf", 1],
      ["text", "setValueIf", 1],
      ["text", "setValueExpression", 1],
      ["text", "defaultValueExpression", 1],
      ["text", "requiredIf", 1]
    ]);
  });

  test("Test validateExpressions rating", () => {

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

    expect(result.length, "There are 1 invalid expressions").toBe(1);
    expect(result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]), "obj + property + count").toEqual([
      ["ratingitem", "visibleIf", 1]
    ]);
  });

  test("Test validateExpressions panel", () => {

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

    expect(result.length, "There are 7 invalid expressions").toBe(7);
    expect(result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]), "obj + property + count").toEqual([
      ["text", "visibleIf", 1],
      ["text", "enableIf", 1],
      ["text", "resetValueIf", 1],
      ["text", "setValueIf", 1],
      ["text", "setValueExpression", 1],
      ["text", "defaultValueExpression", 1],
      ["text", "requiredIf", 1]
    ]);
  });

  test("Test validateExpressions tagbox", () => {

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

    expect(result.length, "There are 2 invalid expressions").toBe(2);
    expect(result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]), "obj + property + count").toEqual([
      ["checkboxitem", "visibleIf", 1],
      ["checkboxitem", "enableIf", 1]
    ]);
  });

  test("Test validateExpressions multipletext", () => {

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

    expect(result.length, "There are 1 invalid expressions").toBe(1);
    expect(result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]), "obj + property + count").toEqual([
      ["expressionvalidator", "expression", 1]
    ]);
  });

  test("Test validateExpressions imagemap", () => {

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

    expect(result.length, "There are 2 invalid expressions").toBe(2);
    expect(result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]), "obj + property + count").toEqual([
      ["imagemaparea", "visibleIf", 1],
      ["imagemaparea", "enableIf", 1]
    ]);
  });

  test("Test validateExpressions check constant in condition error", () => {

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

    expect(result.length, "There are 2 invalid expressions").toBe(2);
    expect(result.map(e => [e.obj.getType(), e.propertyName, e.errors.length]), "obj + property + count").toEqual([
      ["text", "enableIf", 1],
      ["text", "enableIf", 1]
    ]);

    expect(result[0].errors[0].errorType, "error type is SemanticError").toBe(ExpressionErrorType.SemanticError);
    expect(result[1].errors[0].errorType, "error type is SemanticError #2").toBe(ExpressionErrorType.SemanticError);
  });

  test("Direct - reports unknown variable inside paneldynamic ref outer questions #10841", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "paneldynamic",
          name: "q2",
          templateElements: [{
            type: "text",
            name: "q3",
            visibleIf: "{q1} notempty",
          }],
        },
        {
          type: "matrixdynamic",
          name: "q3",
          columns: [{
            name: "c1",
            visibleIf: "{q1} notempty"
          }]
        },
      ],
    });
    let result = survey.validateExpressions({ functions: true, variables: true, semantics: true });
    expect(result.length, "There are 0 invalid expressions").toBe(0);
  });
  test("fromJSON - reports unknown variable inside paneldynamic ref outer questions #10841", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "paneldynamic",
          name: "q2",
          templateElements: [{
            type: "text",
            name: "q3",
            visibleIf: "{q1} notempty",
          }],
        },
        {
          type: "matrixdynamic",
          name: "q3",
          columns: [{
            name: "c1",
            visibleIf: "{q1} notempty"
          }]
        },
      ],
    });
    let result = survey.validateExpressions({ functions: true, variables: true, semantics: true });
    expect(result.length, "There are 0 invalid expressions").toBe(0);
  });
  test("fromJSON & design mode - reports unknown variable inside paneldynamic ref outer questions #10841", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "paneldynamic",
          name: "q2",
          templateElements: [{
            type: "text",
            name: "q3",
            visibleIf: "{q1} notempty",
          }],
        },
        {
          type: "matrixdynamic",
          name: "q3",
          columns: [{
            name: "c1",
            visibleIf: "{q1} notempty"
          }]
        },
      ],
    });
    let result = survey.validateExpressions({ functions: true, variables: true, semantics: true });
    expect(result.length, "There are 0 invalid expressions").toBe(0);
  });
  test("validate expressions in empty paneldynamic by arrays, but with set panelCount property, Bug#10841", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      elements: [
        {
          type: "paneldynamic",
          name: "q1",
          panelCount: 1,
          templateElements: [
            {
              type: "text",
              name: "q2",
              inputType: "number",
            },
          ],
        },
        {
          type: "expression",
          name: "q3",
          expression: "{q1[0].q2} notempty",
        }
      ],
    });
    const result = survey.validateExpression("expression", "{q1[0].q2} notempty", { functions: true, variables: true, semantics: true });
    expect(result, "There is no error in expression with paneldynamic array item").toBeUndefined();
    let results = survey.validateExpressions({ functions: true, variables: true, semantics: true });
    expect(results.length, "There are 0 invalid expressions").toBe(0);
  });
  test("validate expressions in empty matrixdynamic by arrays, but with set rowCount property, Bug#10841", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      elements: [
        {
          type: "matrixdynamic",
          name: "q1",
          rowCount: 1,
          columns: [
            {
              cellType: "text",
              name: "q2",
              inputType: "number",
            },
          ],
        },
        {
          type: "expression",
          name: "q3",
          expression: "{q1[0].q2} notempty",
        }
      ],
    });
    const result = survey.validateExpression("expression", "{q1[0].q2} notempty", { functions: true, variables: true, semantics: true });
    expect(result, "There is no error in expression with paneldynamic array item").toBeUndefined();
    let results = survey.validateExpressions({ functions: true, variables: true, semantics: true });
    expect(results.length, "There are 0 invalid expressions").toBe(0);
  });
  test("validateExpressions() creates extra panel instances when defaultValue set on question inside templateElements[], Bug#10881", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      elements: [
        {
          type: "paneldynamic",
          name: "q1",
          panelCount: 1,
          templateElements: [
            {
              type: "text",
              name: "q2",
              inputType: "number",
              defaultValue: 1
            },
          ],
        }
      ],
    });
    const q1 = survey.getQuestionByName("q1");
    expect(q1.panelCount, "panelCount is 1 before validateExpressions").toBe(1);
    const results = survey.validateExpressions({ functions: true, variables: true, semantics: true });
    expect(results.length, "There are 0 invalid expressions").toBe(0);
    expect(q1.panelCount, "panelCount is 1 after validateExpressions").toBe(1);
  });

  test("validateExpressions() incorrectly reports UnknownVariable in array functions #11082", () => {

    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "paneldynamic",
          templateElements: [{
            type: "slider",
            name: "quantity",
          }],
        },
        {
          type: "text",
          name: "q1",
          setValueExpression: "sumInArray({paneldynamic}, 'quantity', {quantity} > 0)",
        },
        {
          type: "text",
          name: "q2",
          setValueExpression: "minInArray({paneldynamic}, 'quantity', {quantity} > 0)",
        },
        {
          type: "text",
          name: "q3",
          setValueExpression: "maxInArray({paneldynamic}, 'quantity', {quantity} > 0)",
        },
        {
          type: "text",
          name: "q4",
          setValueExpression: "countInArray({paneldynamic}, 'quantity', {quantity} > 0)",
        },
        {
          type: "text",
          name: "q5",
          setValueExpression: "avgInArray({paneldynamic}, 'quantity', {quantity} > 0)",
        },
        {
          type: "text",
          name: "q11",
          setValueExpression: "sumInArray({paneldynamic}, 'quantity', {foo} > 0)",
        },
        {
          type: "text",
          name: "q12",
          setValueExpression: "minInArray({paneldynamic}, 'quantity', {foo} > 0)",
        },
        {
          type: "text",
          name: "q13",
          setValueExpression: "maxInArray({paneldynamic}, 'quantity', {foo} > 0)",
        },
        {
          type: "text",
          name: "q14",
          setValueExpression: "countInArray({paneldynamic}, 'quantity', {foo} > 0)",
        },
        {
          type: "text",
          name: "q15",
          setValueExpression: "avgInArray({paneldynamic}, 'quantity', {foo} > 0)",
        }
      ],
    });

    const result = survey.validateExpressions({ functions: true, variables: true, semantics: true });

    expect(result.length, "There are 5 invalid expressions").toBe(5);
    expect(result.map(e => [(<any>e.obj).name, e.errors.map(er => [er.errorType, er.variableName]).join()]).join(), "Errors are correct").toBe("q11,2,foo,q12,2,foo,q13,2,foo,q14,2,foo,q15,2,foo");
  });
});
