import * as React from "react";
import { ReactSurveyElement } from "./reactquestion_element";
import { Base, QuestionTagboxModel, ItemValue } from "survey-core";
import { SvgIcon } from "./components/svg-icon/svg-icon";
import { attachKey2click } from "./reactSurvey";

export class SurveyQuestionTagboxItem extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionTagboxModel {
    return this.props.question;
  }
  protected get item(): ItemValue {
    return this.props.item;
  }
  protected canRender(): boolean {
    return !!this.item && !!this.question;
  }
  protected renderElement(): React.JSX.Element {
    const text = this.renderLocString(this.item.locText);

    const removeItem = (event: any) => {
      this.question.dropdownListModel.deselectItem(this.item.value);
      event.stopPropagation();
    };

    return (
      <div className={this.question.cssClasses.tagItem}>
        <div className={this.question.cssClasses.tagItemText}>{text}</div>
        <div className={this.question.cssClasses.cleanItem}>
          {this.renderRemoveButton(removeItem)}
        </div>
      </div>
    );
  }

  private renderRemoveButton(removeItem: (event: any) => void) {
    return attachKey2click(<div
      tabIndex={0}
      className={this.question.cssClasses.cleanItemButton}
      onClick={removeItem}
    >
      <SvgIcon
        className={this.question.cssClasses.cleanItemButtonSvg}
        iconName={this.question.cssClasses.cleanItemButtonIconId}
        size={"auto"}
      ></SvgIcon>
    </div>);
  }
}