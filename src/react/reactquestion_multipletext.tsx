import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { SurveyElementErrors, SurveyQuestionAndErrorsWrapped } from "./reactquestion";
import { QuestionMultipleTextModel } from "survey-core";
import { MultipleTextItemModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionMultipleText extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionMultipleTextModel {
    return this.questionBase as QuestionMultipleTextModel;
  }
  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    var tableRows = this.question.getRows();
    var rows = [];
    for (var i = 0; i < tableRows.length; i++) {
      rows.push(this.renderRow(i, tableRows[i], cssClasses));
    }
    return (
      <table className={cssClasses.root}>
        <tbody>{rows}</tbody>
      </table>
    );
  }
  protected renderItemTooltipError(item: MultipleTextItemModel, cssClasses: any): JSX.Element {
    return this.question.isErrorsModeTooltip ? (
      <SurveyElementErrors
        element={item.editor}
        cssClasses={cssClasses}
        creator={this.creator}
        location={"tooltip"}
        id={item.editor.id + "_errors"}
      />
    ): null;
  }
  protected renderRow(
    rowIndex: number,
    items: Array<MultipleTextItemModel>,
    cssClasses: any
  ) {
    var key: string = "item" + rowIndex;
    var tds = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var itemTitle = this.renderLocString(item.locTitle);
      var spans = [];
      var ed = item.editor;
      if (!!ed.isRequireTextOnStart || ed.isRequireTextBeforeTitle) {
        spans.push(
          <span
            key={"requiredTextBefore" + i}
            className={cssClasses.requiredText}
          >
            {ed.requiredText}
          </span>
        );
        spans.push(<span key={"spaceBefore" + i}>&nbsp;</span>);
      }
      spans.push(
        <span key={"itemTitle" + i}>
          {itemTitle}
        </span>
      );
      if (!!ed.isRequireTextAfterTitle) {
        spans.push(<span key={"spaceB" + i}>&nbsp;</span>);
        spans.push(
          <span
            key={"requiredTextAfter" + i}
            className={cssClasses.requiredText}
          >
            {ed.requiredText}
          </span>
        );
      }
      tds.push(
        <td key={"item" + i} className={this.question.cssClasses.cell}>
          <label className={this.question.getItemLabelCss(item)}>
            <span className={cssClasses.itemTitle}>
              {spans}
            </span>
            <SurveyMultipleTextItemEditor
              cssClasses={cssClasses}
              itemCss={this.question.getItemCss()}
              question={item.editor}
              creator={this.creator}
            />
            {this.renderItemTooltipError(item, cssClasses)}
          </label>
        </td>
      );
    }
    return (
      <tr key={key} className={cssClasses.row}>
        {tds}
      </tr>
    );
  }
}

export class SurveyMultipleTextItemEditor extends SurveyQuestionAndErrorsWrapped {
  protected renderElement(): JSX.Element {
    return <div className={this.itemCss}>{this.renderContent()}</div>;
  }
}

ReactQuestionFactory.Instance.registerQuestion("multipletext", (props) => {
  return React.createElement(SurveyQuestionMultipleText, props);
});
