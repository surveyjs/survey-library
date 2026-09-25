// Prototype for the #11873 showcase: the shipping sort UI will replace this file. The glyphs, the
// inline styles and the English title/aria text are hard-coded on purpose - there is no design and
// no localized string for a sortable header yet.
import * as React from "react";
import { Base, IDynamicDataSort, QuestionMatrixDropdownRenderedCell } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";

// The matrix side of the sort: the question owns the cycle, the header only passes the modifier on.
interface IDynamicDataSortQuestion extends Base {
  sortOrder: Array<IDynamicDataSort>;
  toggleSort(field: string, addToSort?: boolean): void;
}
interface IDynamicDataSortHeaderProps {
  cell: QuestionMatrixDropdownRenderedCell;
  question: IDynamicDataSortQuestion;
  content: React.JSX.Element | null;
}

const buttonStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "4px", padding: 0, border: "none",
  background: "none", font: "inherit", color: "inherit", cursor: "pointer", textAlign: "left"
};
// The eslint i18n rule rejects non-ASCII source characters, so the glyphs are escaped.
const unsortedGlyph = "\u2195";
const ascGlyph = "\u25B2";
const descGlyph = "\u25BC";
const sortedGlyphStyle: React.CSSProperties = { fontSize: "11px" };
const unsortedGlyphStyle: React.CSSProperties = { fontSize: "11px", opacity: 0.35 };

const getSort = (question: IDynamicDataSortQuestion, field: string): IDynamicDataSort => {
  const sortOrder = !!question ? question.sortOrder : null;
  if (!Array.isArray(sortOrder) || !field) return null;
  return sortOrder.filter((s: IDynamicDataSort): boolean => s.field === field)[0];
};

/* aria-sort belongs to the <th>, which the table renderer owns, so the lookup lives here next to
   the indicator that uses the same answer. It is undefined for a column that does not sort, which
   is what keeps the header markup of an ordinary matrix unchanged. */
export function getDynamicDataAriaSort(cell: QuestionMatrixDropdownRenderedCell, question: any): "ascending" | "descending" | "none" | undefined {
  const column: any = cell.column;
  if (!column || column.isSortable !== true) return undefined;
  const sort = getSort(question, column.sortField);
  if (!sort) return "none";
  return sort.direction === "desc" ? "descending" : "ascending";
}

export class SurveyQuestionDynamicDataSortHeader extends SurveyElementBase<IDynamicDataSortHeaderProps, any> {
  private get question(): IDynamicDataSortQuestion {
    return this.props.question;
  }
  private get field(): string {
    const column: any = this.props.cell.column;
    return !!column ? column.sortField : "";
  }
  /* The question, not the rendered cell: a sort rebuilds the table, but a rank badge also changes
     when another column is added to the sort and this cell's own instance survives. */
  protected getStateElement(): Base | null {
    return this.question;
  }
  private toggleSort(e: React.MouseEvent | React.KeyboardEvent): void {
    // Shift is what most data grids use for an additive sort and Ctrl/Cmd is what MUI uses; a
    // prototype takes both so a showcase can be driven either way.
    const addToSort = e.shiftKey || e.ctrlKey || e.metaKey;
    this.question.toggleSort(this.field, addToSort);
  }
  private handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
    e.preventDefault();
    this.toggleSort(e);
  }
  private renderIndicator(): React.JSX.Element {
    const sort = getSort(this.question, this.field);
    if (!sort) return <span style={unsortedGlyphStyle} aria-hidden="true">{unsortedGlyph}</span>;
    // The rank makes a multi-field sort legible: it is the 1-based place of the field in sortOrder.
    const rank = this.question.sortOrder.length > 1 ? "" + (this.question.sortOrder.indexOf(sort) + 1) : "";
    return <span style={sortedGlyphStyle} aria-hidden="true">{(sort.direction === "desc" ? descGlyph : ascGlyph) + rank}</span>;
  }
  protected renderElement(): React.JSX.Element {
    const title = this.props.cell.getTitle();
    return <button
      type="button"
      style={buttonStyle}
      title={"Sort by " + title + " (Shift or Ctrl/Cmd to add to the sort)"}
      aria-label={"Sort by " + title}
      onClick={(e: React.MouseEvent) => this.toggleSort(e)}
      onKeyDown={(e: React.KeyboardEvent) => this.handleKeyDown(e)}
    >{this.props.content}{this.renderIndicator()}</button>;
  }
}

ReactElementFactory.Instance.registerElement("sv-dynamic-data-sort-header",
  (props) => { return React.createElement(SurveyQuestionDynamicDataSortHeader, props); });
