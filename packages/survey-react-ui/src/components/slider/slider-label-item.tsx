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
    const { cssClasses, handleLabelPointerUp, getLabelCss, getPercent, getLabelMaxWidth } = this.question;
    const { value, locText } = this.item;
    let labelText = null;
    let labelTextSecondary = null;
    if (this.item.showValue) {
      labelText = <div className={cssClasses.labelText} title={"" + this.item.value}>{this.item.value}</div>;
      labelTextSecondary = <div className={cssClasses.labelTextSecondaryMode} title={locText.renderedHtml}>
        {this.renderLocString(locText)}
      </div>;
    } else {
      labelText = <div className={cssClasses.labelText} title={locText.renderedHtml}>
        {this.renderLocString(locText)}
      </div>;
    }
    return <div key={this.item.uniqueId} className={getLabelCss(locText)}
      style={{ left: getPercent(value) + "%", maxWidth: getLabelMaxWidth(this.item) }}
      onPointerUp={ (e)=>{ handleLabelPointerUp(e.nativeEvent, value); } }>
      <div className={cssClasses.labelTick}></div>
      <div className={cssClasses.labelTextContainer}>
        {labelText}
        {labelTextSecondary}
      </div>
    </div>;
  }
}

ReactElementFactory.Instance.registerElement("sv-slider-label-item", (props) => {
  return React.createElement(SliderLabelItem, props);
});
