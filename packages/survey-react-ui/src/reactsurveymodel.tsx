import { SurveyModel, QuestionMatrixDropdownRenderedCell, SurveyElement, QuestionRowModel, ItemValue, QuestionSelectBase } from "survey-core";
import { ReactElementFactory } from "./element-factory";

export class ReactSurveyElementsWrapper {
  public static wrapRow(survey: SurveyModel, element: JSX.Element, row: QuestionRowModel): JSX.Element {
    const componentName = survey.getRowWrapperComponentName(row);
    const componentData = survey.getRowWrapperComponentData(row);
    return ReactElementFactory.Instance.createElement(componentName, {
      element,
      row,
      componentData,
    });
  }
  public static wrapElement(survey: SurveyModel, element: JSX.Element, question: SurveyElement): JSX.Element {
    const componentName = survey.getElementWrapperComponentName(question);
    const componentData = survey.getElementWrapperComponentData(question);
    return ReactElementFactory.Instance.createElement(componentName, {
      element,
      question,
      componentData,
    });
  }
  public static wrapQuestionContent(survey: SurveyModel, element: JSX.Element, question: SurveyElement): JSX.Element {
    const componentName = survey.getQuestionContentWrapperComponentName(question);
    const componentData = survey.getElementWrapperComponentData(question);
    return ReactElementFactory.Instance.createElement(componentName, {
      element,
      question,
      componentData,
    });
  }
  public static wrapItemValue(survey: SurveyModel, element: JSX.Element, question: QuestionSelectBase, item: ItemValue): JSX.Element {
    const componentName = survey.getItemValueWrapperComponentName(item, question);
    const componentData = survey.getItemValueWrapperComponentData(item, question);
    return ReactElementFactory.Instance.createElement(componentName, {
      key: element?.key,
      element,
      question,
      item,
      componentData,
    });
  }
  public static wrapMatrixCell(survey: SurveyModel, element: JSX.Element, cell: QuestionMatrixDropdownRenderedCell, reason: string = "cell"): JSX.Element {
    const componentName = survey.getElementWrapperComponentName(cell, reason);
    const componentData = survey.getElementWrapperComponentData(cell, reason);
    return ReactElementFactory.Instance.createElement(componentName, {
      element,
      cell,
      componentData,
    });
  }
}

SurveyModel.platform = "react";
