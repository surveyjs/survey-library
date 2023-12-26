import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { ISurveyCreator, SurveyQuestionAndErrorsWrapped, SurveyQuestionErrorCell } from "./reactquestion";
import { QuestionMultipleTextModel, MultipleTextItemModel, MultipleTextCell } from "survey-core";
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
    var rows: Array<JSX.Element> = [];
    for (var i = 0; i < tableRows.length; i++) {
      if (tableRows[i].isVisible) {
        rows.push(this.renderRow(i, tableRows[i].cells, cssClasses));
      }
    }
    return (
      <table className={this.question.getQuestionRootCss()}>
        <tbody>{rows}</tbody>
      </table>
    );
  }

  protected renderCell(cell: MultipleTextCell, cssClasses: any, index: number): JSX.Element {
    let cellContent: JSX.Element;
    const focusIn = () => { cell.item.focusIn(); };
    if (cell.isErrorsCell) {
      cellContent = <SurveyQuestionErrorCell question={cell.item.editor} creator={this.creator}></SurveyQuestionErrorCell>;
    } else {
      cellContent = <SurveyMultipleTextItem question={this.question} item={cell.item} creator={this.creator} cssClasses={cssClasses}></SurveyMultipleTextItem>;
    }
    return (<td key={"item" + index} className={cell.className} onFocus={focusIn}>{cellContent}</td>);
  }

  protected renderRow(
    rowIndex: number,
    cells: Array<MultipleTextCell>,
    cssClasses: any
  ): JSX.Element {
    const key: string = "item" + rowIndex;
    const tds: Array<JSX.Element> = [];
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      tds.push(
        this.renderCell(cell, cssClasses, i)
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
    const titleStyle: any = {};
    if (!!this.question.itemTitleWidth) {
      titleStyle.minWidth = this.question.itemTitleWidth;
      titleStyle.width = this.question.itemTitleWidth;
    }
    return (<label className={this.question.getItemLabelCss(item)}>
      <span className={cssClasses.itemTitle} style={titleStyle}>
        <TitleContent element={item.editor} cssClasses={item.editor.cssClasses}></TitleContent>
      </span>
      <SurveyMultipleTextItemEditor
        cssClasses={cssClasses}
        itemCss={this.question.getItemCss()}
        question={item.editor}
        creator={this.creator}
      />
    </label>);
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
