import * as React from "react";
import { ReactSurveyElement } from "./reactquestion_element";
import { Base, QuestionTagboxModel, ItemValue } from "survey-core";
import { SvgIcon } from "./components/svg-icon/svg-icon";

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
  protected renderElement(): JSX.Element {
    const text = this.renderLocString(this.item.locText);

    const removeItem = (event: any) => {
      this.question.dropdownListModel.deselectItem(this.item.value);
      event.stopPropagation();
    };

    return (
      <div className="sv-tagbox__item">
        <div className="sv-tagbox__item-text">{text}</div>
        <div
          className={ this.question.cssClasses.cleanItemButton}
          onClick={removeItem}
        >
          <SvgIcon
            className={this.question.cssClasses.cleanItemButtonSvg}
            iconName={this.question.cssClasses.cleanItemButtonIconId}
            size={"auto"}
          ></SvgIcon>
        </div>
      </div>
    );
  }
}