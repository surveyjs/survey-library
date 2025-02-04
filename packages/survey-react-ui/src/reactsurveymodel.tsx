import { SurveyModel, QuestionMatrixDropdownRenderedCell, SurveyElement, QuestionRowModel, ItemValue, QuestionSelectBase } from "survey-core";
import { ReactElementFactory } from "./element-factory";

export class ReactSurveyElementsWrapper {
  public static wrapRow(survey: SurveyModel, element: React.JSX.Element, row: QuestionRowModel): React.JSX.Element {
    const componentName = survey.getRowWrapperComponentName(row);
    const componentData = survey.getRowWrapperComponentData(row);
    return ReactElementFactory.Instance.createElement(componentName, {
      element,
      row,
      componentData,
    });
  }
  public static wrapElement(survey: SurveyModel, element: React.JSX.Element, question: SurveyElement): React.JSX.Element {
    const componentName = survey.getElementWrapperComponentName(question);
    const componentData = survey.getElementWrapperComponentData(question);
    return ReactElementFactory.Instance.createElement(componentName, {
      element,
      question,
      componentData,
    });
  }
  public static wrapQuestionContent(survey: SurveyModel, element: React.JSX.Element, question: SurveyElement): React.JSX.Element {
    const componentName = survey.getQuestionContentWrapperComponentName(question);
    const componentData = survey.getElementWrapperComponentData(question);
    return ReactElementFactory.Instance.createElement(componentName, {
      element,
      question,
      componentData,
    });
  }
  public static wrapItemValue(survey: SurveyModel, element: React.JSX.Element, question: QuestionSelectBase, item: ItemValue): React.JSX.Element {
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
  public static wrapMatrixCell(survey: SurveyModel, element: React.JSX.Element, cell: QuestionMatrixDropdownRenderedCell, reason: string = "cell"): React.JSX.Element {
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
