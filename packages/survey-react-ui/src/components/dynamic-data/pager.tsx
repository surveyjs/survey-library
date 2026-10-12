// Prototype for the #11873 showcase: the shipping pager UI will replace this file. The styles are
// inline objects on purpose - there is no design for a pager yet, and a half-guessed CSS class in
// the theme is harder to delete than a style object here. The texts the question's own pagerActions
// use (pagePrevText, pageNextText, indexText) are localized; the rest is hard-coded English.
import * as React from "react";
import { Base, Question } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";

// The question answers every number the pager shows: it never computes a page of its own.
interface IDynamicDataPagerQuestion extends Question {
  pageIndex: number;
  pageCount: number;
  isCountKnown: boolean;
  canGoPrevPage: boolean;
  canGoNextPage: boolean;
  isDataLoading: boolean;
  goToPage(index: number): boolean;
  prevPage(): boolean;
  nextPage(): boolean;
}

const barStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "8px", padding: "8px 0", fontSize: "14px"
};
const buttonStyle: React.CSSProperties = {
  minWidth: "28px", padding: "2px 8px", border: "1px solid #ccc", borderRadius: "3px",
  background: "#fff", cursor: "pointer", lineHeight: "20px"
};
const disabledStyle: React.CSSProperties = { ...buttonStyle, color: "#aaa", borderColor: "#e4e4e4", cursor: "default" };
const currentStyle: React.CSSProperties = { ...buttonStyle, fontWeight: 700, borderColor: "#666" };
const loadingStyle: React.CSSProperties = { color: "#888" };
// The eslint i18n rule rejects non-ASCII source characters, so the glyphs are escaped.
const prevGlyph = "\u2039";
const nextGlyph = "\u203A";
// Above this many pages the numbers give way to the plain "3 of 12" indicator.
const maxNumberedPages = 7;

export class SurveyQuestionDynamicDataPager extends SurveyElementBase<{ question: IDynamicDataPagerQuestion }, any> {
  protected get question(): IDynamicDataPagerQuestion {
    return this.props.question;
  }
  // pageIndex, pageCount and isDataLoading are ordinary question properties, so the base class
  // re-renders the pager through onPropertyChanged.
  protected getStateElement(): Base | null {
    return this.question;
  }
  // One page is no paging: the design and single-input modes, which do not page, report one too.
  protected canRender(): boolean {
    return !!this.question && this.question.pageCount > 1;
  }
  private renderButton(key: string, text: string, enabled: boolean, title: string, action: () => void, isCurrent?: boolean): React.JSX.Element {
    const style = !enabled ? disabledStyle : (isCurrent ? currentStyle : buttonStyle);
    return <button
      type="button"
      key={key}
      style={style}
      disabled={!enabled}
      title={title}
      aria-label={title}
      aria-current={isCurrent ? "true" : undefined}
      onClick={() => action()}
    >{text}</button>;
  }
  private renderIndicator(enabled: boolean): Array<React.JSX.Element> {
    const question = this.question;
    const pageCount = question.pageCount;
    const page = question.pageIndex + 1;
    // A source that has not reported its total makes pageCount the pages found so far, not a total.
    if (!question.isCountKnown) {
      return [<span key="info">{"" + page}</span>];
    }
    if (pageCount > maxNumberedPages) {
      return [<span key="info">{question.getLocalizationFormatString("indexText", page, pageCount)}</span>];
    }
    const res: Array<React.JSX.Element> = [];
    for (let i = 0; i < pageCount; i++) {
      const isCurrent = i === question.pageIndex;
      res.push(this.renderButton("page" + i, "" + (i + 1), enabled && !isCurrent, "Page " + (i + 1),
        () => question.goToPage(i), isCurrent));
    }
    return res;
  }
  protected renderElement(): React.JSX.Element {
    const question = this.question;
    const isLoading = question.isDataLoading;
    return <div style={barStyle} role="navigation" aria-label="Pagination">
      {this.renderButton("prev", prevGlyph, question.canGoPrevPage && !isLoading, question.getLocalizationString("pagePrevText"), () => question.prevPage())}
      {this.renderIndicator(!isLoading)}
      {this.renderButton("next", nextGlyph, question.canGoNextPage && !isLoading, question.getLocalizationString("pageNextText"), () => question.nextPage())}
      {isLoading ? <span style={loadingStyle}>Loading...</span> : null}
    </div>;
  }
}

ReactElementFactory.Instance.registerElement("sv-dynamic-data-pager",
  (props) => { return React.createElement(SurveyQuestionDynamicDataPager, props); });
