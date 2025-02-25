import * as React from "react";
import { QuestionSingleInputSummary, QuestionSingleInputSummaryItem } from "survey-core";
import { ReactSurveyElement } from "./reactquestion_element";
import { ReactElementFactory } from "./element-factory";
import { SvgIcon } from "./components/svg-icon/svg-icon";

export class SurveyQuestionSigleInputSummary extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
  }
  private get css() {
    return this.props.css;
  }
  protected get summary(): QuestionSingleInputSummary {
    return this.props.summary as QuestionSingleInputSummary;
  }
  protected renderElement(): React.JSX.Element {
    if (!this.summary) return null;
    return this.summary.items.length > 0 ? this.renderItems() : this.renderNoItems();
  }
  private renderItems(): React.JSX.Element {
    return (
      <div className={this.css.summary}>
        {this.summary.items.map((item, index) => this.renderItem(item, index))}
      </div>
    );
  }
  private renderNoItems(): React.JSX.Element {
    return <div>
      {this.renderLocString(this.summary.noEntry)}
      <button onClick={() => this.summary.bntAdd.action()}>{this.renderLocString(this.summary.bntAdd.locTitle)}</button>
    </div>;
  }
  private renderItem(item: QuestionSingleInputSummaryItem, index: number): React.JSX.Element {
    return <div className={this.css.summaryRow} key={index}>
      <div className={this.css.summaryRowContent}>{this.renderLocString(item.locText)}</div>
      <div className={this.css.summaryRowActions}>
        <button className={this.css.summaryRowActionEdit} onClick={() => item.btnEdit.action()} title={item.btnEdit.title}>
          <SvgIcon iconName="icon-editsmall-16x16" iconSize="auto" />
        </button>
        <button className={this.css.summaryRowActionDelete} onClick={() => item.btnRemove.action()} title={item.btnRemove.title}>
          <SvgIcon iconName="icon-delete-16x16" iconSize="auto" />
        </button>
      </div>
    </div>;
  }
}

ReactElementFactory.Instance.registerElement("sv-singleinput-summary", (props) => {
  return React.createElement(SurveyQuestionSigleInputSummary, props);
});
