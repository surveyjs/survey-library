import * as React from "react";
import { ItemValue, QuestionSliderModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { ReactSurveyElement } from "../../reactquestion_element";

export class SliderLabelItem extends ReactSurveyElement {
  protected get index(): number {
    return this.props.index;
  }
  protected get item(): ItemValue {
    return this.props.item;
  }
  protected get question(): QuestionSliderModel {
    return this.props.question;
  }

  protected renderElement(): React.JSX.Element {
    const { cssClasses, handleLabelPointerUp, getLabelCss } = this.question;
    const { value, locText: text } = this.item;
    const index = this.index;
    return <div key={index} className={getLabelCss(index)}
      style={{ left: value + "%" }} onPointerUp={ (e)=>{ handleLabelPointerUp(e.nativeEvent, index); } }>
      <div className={cssClasses.labelTick}></div>
      <div className={cssClasses.labelText}>
        {this.renderLocString(text)}
      </div>
    </div>;
  }
}

ReactElementFactory.Instance.registerElement("sv-slider-label-item", (props) => {
  return React.createElement(SliderLabelItem, props);
});
