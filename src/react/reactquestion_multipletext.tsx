import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { ISurveyCreator, SurveyElementErrors, SurveyQuestionAndErrorsWrapped } from "./reactquestion";
import { QuestionMultipleTextModel } from "survey-core";
import { MultipleTextItemModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactSurveyElement } from "./reactquestion_element";
import { TitleContent } from "./components/title/title-content";

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
  protected renderRow(
    rowIndex: number,
    items: Array<MultipleTextItemModel>,
    cssClasses: any
  ) {
    var key: string = "item" + rowIndex;
    var tds = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      tds.push(
        <td key={"item" + i} className={this.question.cssClasses.cell}>
          <SurveyMultipleTextItem question={this.question} item={item} creator={this.creator} cssClasses={cssClasses}></SurveyMultipleTextItem>
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

export class SurveyMultipleTextItem extends ReactSurveyElement {
  private get question(): QuestionMultipleTextModel {
    return this.props.question;
  }
  private get item(): MultipleTextItemModel {
    return this.props.item;
  }
  protected getStateElements() {
    return [this.item, this.item.editor];
  }
  private get creator(): ISurveyCreator {
    return this.props.creator;
  }

  protected renderElement() {
    const item = this.item;
    const cssClasses = this.cssClasses;
    return (<label className={this.question.getItemLabelCss(item)}>
      <span className={cssClasses.itemTitle}>
        <TitleContent element={item.editor} cssClasses={item.editor.cssClasses}></TitleContent>
      </span>
      <SurveyMultipleTextItemEditor
        cssClasses={cssClasses}
        itemCss={this.question.getItemCss()}
        question={item.editor}
        creator={this.creator}
      />
      {this.renderItemTooltipError(item, cssClasses)}
    </label>);
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
}

export class SurveyMultipleTextItemEditor extends SurveyQuestionAndErrorsWrapped {
  protected renderElement(): JSX.Element {
    return <div className={this.itemCss}>{this.renderContent()}</div>;
  }
}

ReactQuestionFactory.Instance.registerQuestion("multipletext", (props) => {
  return React.createElement(SurveyQuestionMultipleText, props);
});
