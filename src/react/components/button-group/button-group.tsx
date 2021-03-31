import * as React from "react";
import {
  QuestionSelectBase,
  ButtonGroupItemModel,
  RendererFactory,
  ItemValue,
} from "survey-core";
import { SurveyElementBase } from "../../reactquestion_element";
import { ReactQuestionFactory } from "../../reactquestion_factory";
import { SurveyButtonGroupItem } from "./button-group-item";
export { SurveyButtonGroupItem } from "./button-group-item";
export class SurveyButtonGroup extends SurveyElementBase<any, any> {
  constructor(props: any) {
    super(props);
  }
  public get question(): QuestionSelectBase {
    return this.props.question;
  }
  getStateElement() {
    return this.question;
  }
  render() {
    const items = this.renderItems();
    return <div className={this.question.cssClasses.buttonGroup}>{items}</div>;
  }
  renderItems() {
    return this.question.visibleChoices.map(
      (item: ItemValue, index: number) => {
        return (
          <SurveyButtonGroupItem
            key={this.question.inputId + "_" + index}
            item={item}
            question={this.question}
            index={index}
          ></SurveyButtonGroupItem>
        );
      }
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("sv-button-group", (props) => {
  return React.createElement(SurveyButtonGroup, props);
});
RendererFactory.Instance.registerRenderer(
  "radiogroup",
  "button-group",
  "sv-button-group"
);
RendererFactory.Instance.registerRenderer(
  "dropdown",
  "button-group",
  "sv-button-group"
);
