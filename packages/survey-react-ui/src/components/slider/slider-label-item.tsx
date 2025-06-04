import * as React from "react";
import { Base, ItemValue, QuestionSliderModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { ReactSurveyElement, SurveyElementBase } from "../../reactquestion_element";

export class SliderLabelItem extends SurveyElementBase<any, any> {
  protected getStateElement(): Base {
    return this.item;
  }
  protected get item(): ItemValue {
    return this.props.item;
  }
  protected get question(): QuestionSliderModel {
    return this.props.question;
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
  }

  protected renderElement(): React.JSX.Element {
    const { cssClasses, handleLabelPointerUp, getLabelCss, getPercent } = this.question;
    const { value, locText } = this.item;
    return <div key={this.item.id} className={getLabelCss(locText)}
      style={{ left: getPercent(value) + "%" }} onPointerUp={ (e)=>{ handleLabelPointerUp(e.nativeEvent, value); } }>
      <div className={cssClasses.labelTick}></div>
      <div className={cssClasses.labelText}>
        {this.renderLocString(locText)}
      </div>
    </div>;
  }
}

ReactElementFactory.Instance.registerElement("sv-slider-label-item", (props) => {
  return React.createElement(SliderLabelItem, props);
});
