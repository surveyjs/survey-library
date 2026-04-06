import * as React from "react";
import { attachKey2click } from "../../reactSurvey";
import { ReactSurveyElement } from "../../reactquestion_element";
import { QuestionFileModel } from "survey-core";
import { SvgIcon } from "../svg-icon/svg-icon";
import { ReactElementFactory } from "../../element-factory";
import { SurveyLocStringViewer } from "src/string-viewer";

export class SurveyFileChooseButton extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionFileModel {
    return (this.props.item && this.props.item.data.question) || this.props.data.question;
  }
  render() {
    return attachKey2click(
      <label
        tabIndex={0}
        className={this.props.item.getActionBarItemCss()}
        htmlFor={this.question.inputId}
        aria-label={this.question.chooseButtonText}
        onClick={(e) => this.question.chooseFile(e.nativeEvent)}
      >
        {!!this.props.item.iconName ? <SvgIcon title={this.question.chooseButtonText} iconName={this.question.cssClasses.chooseFileIconId} size={"auto"} className={this.props.item.cssClasses.itemIcon}></SvgIcon> : null}
        {this.props.item.hasTitle ? <SurveyLocStringViewer model={this.props.item.locTitle} textClass={this.props.item.getActionBarItemTitleCss()} /> : null}
      </label>
    );
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-file-choose-btn",
  (props) => {
    return React.createElement(SurveyFileChooseButton, props);
  }
);