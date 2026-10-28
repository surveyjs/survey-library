import * as React from "react";
import { Base, QuestionMatrixDropdownModelBase, QuestionMatrixDropdownRenderedCell } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { ReactSurveyElement } from "../../reactquestion_element";
import { SvgIcon } from "../svg-icon/svg-icon";

// The button a sortable column header holds: the title (content), the direction indicator and the
// description of the whole sort. The cell computes every value; this only renders it.
export class SurveyMatrixHeaderSortButton extends ReactSurveyElement {
  private get cell(): QuestionMatrixDropdownRenderedCell {
    return this.props.cell;
  }
  private get question(): QuestionMatrixDropdownModelBase {
    return this.props.question;
  }
  // The sort, the loading state and the page move live on the question.
  protected getStateElement(): Base | null {
    return this.question;
  }
  private onClick = (event: React.MouseEvent): void => {
    this.cell.toggleSort(event.shiftKey || event.ctrlKey || event.metaKey);
  };
  protected renderElement(): React.JSX.Element | null {
    const cell = this.cell;
    const description = cell.sortDescription;
    const rank = cell.sortRank;
    return (
      <button
        type="button"
        className={cell.sortButtonCss}
        aria-label={cell.sortAriaLabel}
        title={cell.sortTooltip}
        aria-describedby={!!description ? cell.sortDescriptionId : undefined}
        aria-disabled={!cell.canToggleSort ? "true" : undefined}
        onClick={this.onClick}
      >
        <span className={cell.sortTitleCss}>{this.props.content}</span>
        <span className={cell.sortCss} aria-hidden="true">
          <SvgIcon iconName={cell.sortIconName} size={16}></SvgIcon>
          {!!rank ? <span className={cell.sortRankCss}>{rank}</span> : null}
        </span>
        {!!description ? <span id={cell.sortDescriptionId} className="sv-visuallyhidden">{description}</span> : null}
      </button>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-matrix-header-sort-button", (props) => {
  return React.createElement(SurveyMatrixHeaderSortButton, props);
});
