import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase
} from "./reactquestionelement";
import { SurveyQuestionAndErrorsCell } from "./reactquestion";
import { Helpers } from "../helpers";
import { QuestionMultipleTextModel } from "../question_multipletext";
import { MultipleTextItemModel } from "../question_multipletext";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionMultipleText extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionMultipleTextModel {
    return this.questionBase as QuestionMultipleTextModel;
  }
  render(): JSX.Element {
    if (!this.question) return null;
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
      var spaceSpan = <span>&nbsp;</span>;
      var spans = [];
      var ed = item.editor;
      if (!!ed.isRequireTextOnStart || ed.isRequireTextBeforeTitle) {
        spans.push(
          <span className={cssClasses.requiredText}>{ed.requiredText}</span>
        );
        spans.push(spaceSpan);
      }
      spans.push(<span className={cssClasses.itemTitle}>{itemTitle}</span>);
      if (!!ed.isRequireTextAfterTitle) {
        spans.push(spaceSpan);
        spans.push(
          <span className={cssClasses.requiredText}>{ed.requiredText}</span>
        );
      }
      tds.push(
        <td key={"label" + i} className={cssClasses.cell}>
          {spans}
        </td>
      );
      tds.push(
        <SurveyQuestionAndErrorsCell
          key={"value" + i}
          cssClasses={cssClasses}
          question={item.editor}
          creator={this.creator}
        />
      );
    }
    return (
      <tr key={key} className={cssClasses.row}>
        {tds}
      </tr>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("multipletext", props => {
  return React.createElement(SurveyQuestionMultipleText, props);
});
