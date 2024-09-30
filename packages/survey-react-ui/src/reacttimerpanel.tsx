import * as React from "react";
import { Base, SurveyTimerModel } from "survey-core";
import { SvgIcon } from "./components/svg-icon/svg-icon";
import { ReactElementFactory } from "./element-factory";
import { ReactSurveyElement } from "./reactquestion_element";

export class SurveyTimerPanel extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
  }
  protected getStateElement(): Base {
    return this.timerModel;
  }
  protected get timerModel(): SurveyTimerModel {
    return this.props.model;
  }
  private readonly circleLength = 440;
  private get progress(): number {
    return -this.timerModel.progress * this.circleLength;
  }
  render(): JSX.Element | null {
    if(!this.timerModel.isRunning) {
      return null;
    }
    let result = <div className={this.timerModel.survey.getCss().timerRoot}>{this.timerModel.text}</div>;
    if(this.timerModel.showTimerAsClock) {
      let style = { strokeDasharray: this.circleLength, strokeDashoffset: this.progress };
      const progress = (this.timerModel.showProgress ? <SvgIcon className={this.timerModel.getProgressCss()} style={style} iconName={"icon-timercircle"} size={"auto"}></SvgIcon>: null);
      result =
      (<div className={this.timerModel.rootCss}>
        {progress}
        <div className={this.timerModel.textContainerCss}>
          <span className={this.timerModel.majorTextCss}>{this.timerModel.clockMajorText }</span>
          {(this.timerModel.clockMinorText ? <span className={this.timerModel.minorTextCss}>{this.timerModel.clockMinorText }</span> : null)}
        </div>
      </div>);
    }
    return result;
  }
}

ReactElementFactory.Instance.registerElement("sv-timerpanel", (props) => {
  return React.createElement(SurveyTimerPanel, props);
});