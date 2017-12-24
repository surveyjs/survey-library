import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase
} from "./reactquestionelement";
import { Helpers } from "../helpers";
import { QuestionMultipleTextModel } from "../question_multipletext";
import { MultipleTextItemModel } from "../question_multipletext";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionMultipleText extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = { colCountChanged: 0 };
    var self = this;
    this.question.colCountChangedCallback = function() {
      self.setState({ colCountChanged: self.state.colCountChanged + 1 });
    };
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
    rowIndex,
    items: Array<MultipleTextItemModel>,
    cssClasses: any
  ) {
    var key: string = "item" + rowIndex;
    var tds = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var itemTitle = this.renderLocString(item.locTitle);
      tds.push(
        <td key={"label" + i}>
          <span className={cssClasses.itemTitle}>{itemTitle}</span>
        </td>
      );
      tds.push(
        <td key={"value" + i}>
          {this.renderItem(item, rowIndex === 0 && i === 0, cssClasses)}
        </td>
      );
    }
    return (
      <tr key={key} className={cssClasses.row}>
        {tds}
      </tr>
    );
  }
  protected renderItem(
    item: MultipleTextItemModel,
    isFirst: boolean,
    cssClasses: any
  ): JSX.Element {
    let inputId = isFirst ? this.question.inputId : null;
    return (
      <SurveyQuestionMultipleTextItem
        item={item}
        cssClasses={cssClasses}
        isDisplayMode={this.isDisplayMode}
      />
    );
  }
}

export class SurveyQuestionMultipleTextItem extends ReactSurveyElement {
  private item: MultipleTextItemModel;
  constructor(props: any) {
    super(props);
    this.item = props.item;
    this.state = { value: this.getValue(this.item.value) };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
  }
  handleOnChange(event) {
    this.setState({ value: event.target.value });
  }
  handleOnBlur(event) {
    this.item.value = event.target.value;
    this.setState({ value: this.item.value });
  }
  componentWillReceiveProps(nextProps: any) {
    this.item = nextProps.item;
  }
  componentDidMount() {
    if (this.item) {
      var self = this;
      this.item.valueChangedCallback = function(newValue) {
        self.setState({ value: self.getValue(newValue) });
      };
    }
  }
  componentWillUnmount() {
    if (this.item) {
      this.item.valueChangedCallback = null;
    }
  }
  render(): JSX.Element {
    if (!this.item) return null;
    if (this.isDisplayMode)
      return (
        <div id={this.item.id} className={this.cssClasses.itemValue}>
          {this.item.value}
        </div>
      );
    return (
      <input
        id={this.item.id}
        className={this.cssClasses.itemValue}
        type={this.item.inputType}
        value={this.state.value}
        placeholder={this.item.placeHolder}
        onBlur={this.handleOnBlur}
        onChange={this.handleOnChange}
        aria-label={this.item.locTitle.renderedHtml}
      />
    );
  }
  protected get mainClassName(): string {
    return "";
  }
  private getValue(val: any): any {
    if (Helpers.isValueEmpty(val)) return "";
    return val;
  }
}

ReactQuestionFactory.Instance.registerQuestion("multipletext", props => {
  return React.createElement(SurveyQuestionMultipleText, props);
});
