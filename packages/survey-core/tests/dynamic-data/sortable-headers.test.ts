import { describe, test, expect, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { QuestionMatrixDropdownRenderedCell } from "../../src/question_matrixdropdownrendered";
import { ComponentCollection } from "../../src/question_custom";
import { surveyLocalization } from "../../src/surveyStrings";
import { getFirstSortDirection, getSortDirectionItems } from "../../src/records/records-sort-directions";
import { IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource } from "../../src/dynamic-data/dynamic-data-interfaces";

const productColumns = [
  { name: "product", cellType: "text" },
  { name: "price", cellType: "text", inputType: "number" },
  { name: "added", cellType: "text", inputType: "date" },
  { name: "discontinued", cellType: "boolean" }
];
const productRows = [
  { product: "b", price: 20, added: "2024-02-01", discontinued: false },
  { product: "a", price: 30, added: "2024-03-01", discontinued: true },
  { product: "c", price: 10, added: "2024-01-01", discontinued: false }
];
function createMatrix(json?: any, isDesignMode?: boolean): QuestionMatrixDynamicModel {
  const survey = new SurveyModel();
  if (isDesignMode) survey.setDesignMode(true);
  survey.fromJSON({ elements: [Object.assign({
    type: "matrixdynamic", name: "matrix", rowCount: 0, allowSort: true, columns: productColumns
  }, json)] });
  survey.data = { matrix: productRows.map((row: any): any => Object.assign({}, row)) };
  return <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
}
function headerCells(matrix: QuestionMatrixDynamicModel | QuestionMatrixDropdownModel): Array<QuestionMatrixDropdownRenderedCell> {
  return matrix.renderedTable.headerRow.cells;
}
function header(matrix: QuestionMatrixDynamicModel | QuestionMatrixDropdownModel, name: string): QuestionMatrixDropdownRenderedCell {
  return headerCells(matrix).filter((cell: QuestionMatrixDropdownRenderedCell): boolean => !!cell.column && cell.column.name === name)[0];
}
function cellState(cell: QuestionMatrixDropdownRenderedCell): Array<any> {
  return [cell.sortDirection, cell.sortIconName, cell.ariaSort, cell.sortTooltip];
}
function sortOf(matrix: QuestionMatrixDynamicModel): Array<any> {
  return matrix.sortCriteria.map((item: any): any => ({ field: item.field, direction: item.direction }));
}
function columnValues(matrix: QuestionMatrixDynamicModel, name: string): Array<any> {
  return matrix.visibleRows.map((row: any): any => row.getQuestionByName(name).value);
}

describe("Sortable headers: the direction rules", () => {
  test("a number and a date start with the largest value, everything else alphabetically", () => {
    expect(getSortDirectionItems("number"), "#1").toEqual([
      { direction: "desc", locStringName: "sortHighLowText" }, { direction: "asc", locStringName: "sortLowHighText" }]);
    expect(getSortDirectionItems("date"), "#2").toEqual([
      { direction: "desc", locStringName: "sortNewestFirstText" }, { direction: "asc", locStringName: "sortOldestFirstText" }]);
    const alphabet = [{ direction: "asc", locStringName: "sortAZText" }, { direction: "desc", locStringName: "sortZAText" }];
    expect(getSortDirectionItems("boolean"), "#3").toEqual(alphabet);
    expect(getSortDirectionItems("any"), "#4").toEqual(alphabet);
    expect(getSortDirectionItems("string"), "#5").toEqual(alphabet);
    expect(["number", "date", "boolean", "any"].map((type: any): string => getFirstSortDirection(type)), "#6").toEqual(
      ["desc", "desc", "asc", "asc"]);
  });
  test("isValueSortable: a scalar value is sortable, an array, a file, a signature or no value is not", () => {
    ComponentCollection.Instance.add({ name: "checkboxwrapper", questionJSON: { type: "checkbox", choices: [1, 2] } });
    try {
      const survey = new SurveyModel({ elements: [
        { type: "text", name: "text" },
        { type: "text", name: "number", inputType: "number" },
        { type: "text", name: "date", inputType: "date" },
        { type: "dropdown", name: "dropdown", choices: [1, 2] },
        { type: "boolean", name: "boolean" },
        { type: "rating", name: "rating" },
        { type: "expression", name: "expression", expression: "1 + 1" },
        { type: "checkbox", name: "checkbox", choices: [1, 2] },
        { type: "tagbox", name: "tagbox", choices: [1, 2] },
        { type: "file", name: "file" },
        { type: "signaturepad", name: "signature" },
        { type: "html", name: "html" },
        { type: "checkboxwrapper", name: "custom" }
      ] });
      expect(survey.getAllQuestions().map(q => q.isValueSortable)).toEqual(
        [true, true, true, true, true, true, true, false, false, false, false, false, false]);
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
});

describe("Sortable headers: the header cells", () => {
  test("every column header is sortable, the drag and the actions cells are not", () => {
    const matrix = createMatrix({ allowRowReorder: true });
    const cells = headerCells(matrix);
    const columnCells = cells.filter((cell: QuestionMatrixDropdownRenderedCell): boolean => !!cell.column);
    const otherCells = cells.filter((cell: QuestionMatrixDropdownRenderedCell): boolean => !cell.column);
    expect(columnCells.map((cell: QuestionMatrixDropdownRenderedCell): boolean => cell.isSortable), "#1").toEqual([true, true, true, true]);
    expect(otherCells.length > 1, "#2: the drag and the remove cells").toBe(true);
    expect(otherCells.map((cell: QuestionMatrixDropdownRenderedCell): Array<any> => [cell.isSortable, cell.ariaSort, cell.sortDescription]), "#3")
      .toEqual(otherCells.map((): Array<any> => [false, undefined, undefined]));
    const price = header(matrix, "price");
    expect(price.className.indexOf("sd-table__cell--sortable") > -1, "#4: the sortable class").toBe(true);
    expect(price.sortAriaLabel, "#5").toBe("Sort by price");
    expect(price.sortCss, "#6").toBe("sd-table__header-sort sd-table__header-sort--none");
    expect(price.sortButtonCss, "#7").toBe("sd-table__header-sort-button");
  });
  test("a click cycles the column's first direction, the other one, then no sort", () => {
    const matrix = createMatrix();
    const steps: Array<any> = [];
    const record = (name: string): void => {
      header(matrix, name).toggleSort();
      const cell = header(matrix, name);
      steps.push(cellState(cell).concat([cell.sortDescription]));
    };
    record("price"); record("price"); record("price");
    expect(steps, "#1: price").toEqual([
      ["desc", "icon-arrowdown-16x16", "descending", "High - Low", "Sorted by price (High - Low)"],
      ["asc", "icon-arrowup-16x16", "ascending", "Low - High", "Sorted by price (Low - High)"],
      [undefined, "icon-sort-16x16", undefined, undefined, undefined]]);
    steps.length = 0;
    record("product"); record("product"); record("product");
    expect(steps, "#2: product").toEqual([
      ["asc", "icon-arrowup-16x16", "ascending", "Alphabet, A - Z", "Sorted by product (Alphabet, A - Z)"],
      ["desc", "icon-arrowdown-16x16", "descending", "Alphabet, Z - A", "Sorted by product (Alphabet, Z - A)"],
      [undefined, "icon-sort-16x16", undefined, undefined, undefined]]);
    steps.length = 0;
    record("added"); record("added");
    expect(steps.map((step: Array<any>): Array<any> => [step[0], step[3]]), "#3: added").toEqual([["desc", "Newest first"], ["asc", "Oldest first"]]);
    header(matrix, "added").toggleSort();
    record("discontinued");
    expect(steps[2].slice(0, 4), "#4: a boolean column uses the alphabet labels").toEqual(["asc", "icon-arrowup-16x16", "ascending", "Alphabet, A - Z"]);
    header(matrix, "discontinued").toggleSort();
    header(matrix, "discontinued").toggleSort();
    expect(headerCells(matrix).map((cell: QuestionMatrixDropdownRenderedCell): Array<any> => [cell.ariaSort, cell.sortDescription]), "#5: nothing is sorted")
      .toEqual(headerCells(matrix).map((): Array<any> => [undefined, undefined]));
  });
  test("a click on the price header sorts the rows, highest first", () => {
    const matrix = createMatrix();
    header(matrix, "price").toggleSort();
    expect(columnValues(matrix, "price"), "#1").toEqual([30, 20, 10]);
    header(matrix, "price").toggleSort();
    expect(columnValues(matrix, "price"), "#2").toEqual([10, 20, 30]);
    header(matrix, "price").toggleSort();
    expect(columnValues(matrix, "price"), "#3: the original order").toEqual([20, 30, 10]);
  });
  test("question.toggleSort runs the same cycle", () => {
    const matrix = createMatrix();
    const directions: Array<any> = [];
    for (let i = 0; i < 3; i++) {
      matrix.toggleSort("price");
      directions.push(header(matrix, "price").sortDirection);
    }
    for (let i = 0; i < 3; i++) {
      matrix.toggleSort("product");
      directions.push(header(matrix, "product").sortDirection);
    }
    matrix.toggleSort("added");
    directions.push(header(matrix, "added").sortDirection);
    expect(directions).toEqual(["desc", "asc", undefined, "asc", "desc", undefined, "desc"]);
  });
  test("a field the list does not know starts ascending", () => {
    const matrix = createMatrix();
    matrix.toggleSort("unknown");
    expect(sortOf(matrix), "#1").toEqual([{ field: "unknown", direction: "asc" }]);
    expect(matrix.getSortFieldDataType("unknown"), "#2").toBe("any");
    expect(["product", "price", "added", "discontinued"].map((name: string): string => matrix.getSortFieldDataType(name)), "#3")
      .toEqual(["any", "number", "date", "boolean"]);
  });
  test("a sort set from code moves the opposite way: the next click clears it", () => {
    const matrix = createMatrix();
    matrix.sort("price", "asc");
    expect(header(matrix, "price").sortDirection, "#1").toBe("asc");
    header(matrix, "price").toggleSort();
    expect(sortOf(matrix), "#2").toEqual([]);
  });
});

describe("Sortable headers: a sort by more than one column", () => {
  test("Shift-click keeps the first column; only the first one has aria-sort, both have the description", () => {
    const matrix = createMatrix({ maxSortLevel: 2 });
    header(matrix, "price").toggleSort();
    header(matrix, "product").toggleSort(true);
    expect(sortOf(matrix), "#1").toEqual([{ field: "price", direction: "desc" }, { field: "product", direction: "asc" }]);
    const price = header(matrix, "price");
    const product = header(matrix, "product");
    expect([price.sortIconName, product.sortIconName], "#2: both show their arrows").toEqual(["icon-arrowdown-16x16", "icon-arrowup-16x16"]);
    expect([price.ariaSort, product.ariaSort], "#3").toEqual(["descending", undefined]);
    const description = "Sorted by price (High - Low), then by product (Alphabet, A - Z)";
    expect(headerCells(matrix).filter((cell: QuestionMatrixDropdownRenderedCell): boolean => cell.isSortable)
      .map((cell: QuestionMatrixDropdownRenderedCell): string => cell.sortDescription), "#4: on every sortable cell").toEqual(
      [description, description, description, description]);
    expect(product.sortTooltip, "#5: the tooltip is the cell's own direction").toBe("Alphabet, A - Z");
  });
  test("with the default level limit, Shift-click replaces the sort", () => {
    const matrix = createMatrix();
    header(matrix, "price").toggleSort();
    header(matrix, "product").toggleSort(true);
    expect(sortOf(matrix), "#1").toEqual([{ field: "product", direction: "asc" }]);
    expect([header(matrix, "price").sortDirection, header(matrix, "product").ariaSort], "#2").toEqual([undefined, "ascending"]);
  });
});

describe("Sortable headers: the cell identity", () => {
  test("a column header keeps its id across a sort, even when the drag cell leaves the header row", () => {
    const matrix = createMatrix({ allowRowReorder: true });
    const idsBefore = headerCells(matrix).filter((cell: QuestionMatrixDropdownRenderedCell): boolean => !!cell.column)
      .map((cell: QuestionMatrixDropdownRenderedCell): string => cell.id);
    const cellCountBefore = headerCells(matrix).length;
    header(matrix, "price").toggleSort();
    expect(headerCells(matrix).length, "#1: the drag cell has left").toBe(cellCountBefore - 1);
    const idsAfter = headerCells(matrix).filter((cell: QuestionMatrixDropdownRenderedCell): boolean => !!cell.column)
      .map((cell: QuestionMatrixDropdownRenderedCell): string => cell.id);
    expect(idsAfter, "#2").toEqual(idsBefore);
    expect(idsAfter[1], "#3: the column's id").toBe(matrix.getColumnByName("price").renderedId);
    expect(header(matrix, "price").sortDescriptionId, "#4").toBe(idsAfter[1] + "_sortDescription");
    expect(new Set(idsAfter).size, "#5: unique").toBe(4);
  });
  test("a cell without a column keeps a generated id", () => {
    const matrix = createMatrix();
    const actionCell = headerCells(matrix).filter((cell: QuestionMatrixDropdownRenderedCell): boolean => !cell.column)[0];
    const id = actionCell.id;
    expect(!!id, "#1").toBe(true);
    expect(actionCell.id, "#2: the same cell keeps it").toBe(id);
    header(matrix, "price").toggleSort();
    const newActionCell = headerCells(matrix).filter((cell: QuestionMatrixDropdownRenderedCell): boolean => !cell.column)[0];
    expect(newActionCell.id === id, "#3: a rebuilt one gets a new one").toBe(false);
  });
});

describe("Sortable headers: unique header ids", () => {
  test("a transposed matrix: the empty corner cell and the row titles have different ids", () => {
    const survey = new SurveyModel({ elements: [{
      type: "matrixdropdown", name: "matrix", transposeData: true, rows: ["r1", "r2"], columns: [{ name: "a", cellType: "text" }]
    }] });
    const ids = headerCells(<QuestionMatrixDropdownModel>survey.getQuestionByName("matrix"))
      .map((cell: QuestionMatrixDropdownRenderedCell): string => cell.id);
    expect(ids.length, "#1").toBe(3);
    expect(new Set(ids).size, "#2").toBe(3);
  });
  /* A header cell without the survey takes its id from the default generator, which can repeat the
     "scell_0" the corner cell takes from the survey's: React keys the header cells by id. */
  const checkHeaderIds = (json: any, count: number): void => {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdropdown", name: "matrix" }, json)] });
    const cells = headerCells(<QuestionMatrixDropdownModel>survey.getQuestionByName("matrix"));
    expect(cells.length, "#1").toBe(count);
    expect(cells.filter((cell: QuestionMatrixDropdownRenderedCell): boolean => cell.getSurvey() !== survey).length, "#2: every cell has the survey").toBe(0);
    expect(new Set(cells.map((cell: QuestionMatrixDropdownRenderedCell): string => cell.id)).size, "#3: unique").toBe(count);
  };
  test("a column shown in multiple columns: the corner cell and the choice headers have different ids", () => {
    checkHeaderIds({ rows: ["r1", "r2"], columns: [
      { name: "rating", cellType: "radiogroup", choices: [1, 2, 3], showInMultipleColumns: true },
      { name: "comment", cellType: "comment" }] }, 5);
  });
  test("a transposed matrix with totals: the corner cell and the footer title have different ids", () => {
    checkHeaderIds({ transposeData: true, rows: ["r1", "r2"], columns: [{ name: "a", cellType: "text", totalType: "sum" }] }, 4);
  });
});

describe("Sortable headers: where a header does not sort", () => {
  test("allowSort off on the matrix or on a column, and a checkbox column", () => {
    expect(header(createMatrix({ allowSort: false }), "price").isSortable, "#1").toBe(false);
    const matrix = createMatrix({ columns: productColumns.concat([
      <any>{ name: "fixed", cellType: "text", allowSort: false },
      <any>{ name: "tags", cellType: "checkbox", choices: [1, 2] }]) });
    expect([header(matrix, "fixed").isSortable, header(matrix, "tags").isSortable], "#2").toEqual([false, false]);
    expect([matrix.getColumnByName("fixed").isSortable, matrix.getColumnByName("tags").isSortable], "#3").toEqual([false, false]);
    expect(header(matrix, "price").isSortable, "#4").toBe(true);
    const price = header(createMatrix({ allowSort: false }), "price");
    expect([price.ariaSort, price.sortDescription, price.sortTooltip, price.sortAriaLabel, price.className.indexOf("sortable")], "#5")
      .toEqual([undefined, undefined, undefined, undefined, -1]);
    expect(price.toggleSort(), "#6: does nothing").toBe(false);
  });
  test("design mode, a mobile layout, transposed data and no header", () => {
    expect(header(createMatrix({}, true), "price").isSortable, "#1: design mode").toBe(false);
    const mobile = createMatrix();
    mobile.isMobile = true;
    expect(!!mobile.renderedTable.headerRow && header(mobile, "price").isSortable, "#2: mobile").toBe(false);
    const transposed = createMatrix({ transposeData: true });
    const transposedHeader = transposed.renderedTable.showHeader ? headerCells(transposed).filter((cell: QuestionMatrixDropdownRenderedCell): boolean => cell.isSortable) : [];
    expect(transposedHeader.length, "#3: transposed").toBe(0);
    const noHeader = createMatrix({ showHeader: false });
    expect(noHeader.renderedTable.showHeader, "#4: no header").toBe(false);
    expect(noHeader.canSortByHeaders, "#5").toBe(false);
  });
});

class DeferredSource implements IDynamicDataSource {
  public capabilities = { paging: true, filtering: true, sorting: true };
  public pending: Array<() => void> = [];
  constructor(private records: Array<any>) { }
  public read(request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> {
    return new Promise<IDynamicDataReadResult>((resolve) => {
      this.pending.push((): void => {
        const size = request.take > 0 ? request.take : this.records.length;
        resolve({ records: this.records.slice(request.skip, request.skip + size), total: this.records.length });
      });
    });
  }
  public settleAll(): void {
    const list = this.pending;
    this.pending = [];
    list.forEach((settle: () => void): void => settle());
  }
}
async function flush(times: number = 20): Promise<void> {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
  }
}

describe("Sortable headers: when a click is refused", () => {
  test("a page with an empty required cell is not replaced, and the header keeps its state", () => {
    const matrix = createMatrix({ pageSize: 2, columns: productColumns.map((column: any): any =>
      column.name === "product" ? Object.assign({ isRequired: true }, column) : column) });
    matrix.value = [{ price: 1 }, { product: "x", price: 2 }, { product: "y", price: 3 }];
    matrix.visibleRows;
    expect(header(matrix, "price").toggleSort(), "#1").toBe(false);
    expect(sortOf(matrix), "#2").toEqual([]);
    expect(cellState(header(matrix, "price")), "#3").toEqual([undefined, "icon-sort-16x16", undefined, undefined]);
  });
  test("no click while a page is read", async () => {
    const source = new DeferredSource(productRows.map((row: any, index: number): any => Object.assign({ id: index }, row)));
    const matrix = createMatrix({ pageSize: 2 });
    matrix.dataSource = source;
    expect(matrix.isDataLoading, "#1").toBe(true);
    const price = header(matrix, "price");
    expect([price.isSortable, price.canToggleSort], "#2").toEqual([true, false]);
    expect(price.toggleSort(), "#3").toBe(false);
    expect(sortOf(matrix), "#4").toEqual([]);
    source.settleAll();
    await flush();
    expect(matrix.isDataLoading, "#5").toBe(false);
    expect(header(matrix, "price").canToggleSort, "#6").toBe(true);
    expect(header(matrix, "price").toggleSort(), "#7").toBe(true);
    expect(sortOf(matrix), "#8").toEqual([{ field: "price", direction: "desc" }]);
  });
});

describe("Sortable headers: the state follows the matrix", () => {
  test("a sort from code shows on the cells", () => {
    const matrix = createMatrix();
    matrix.sort("price", "asc");
    expect(cellState(header(matrix, "price")), "#1").toEqual(["asc", "icon-arrowup-16x16", "ascending", "Low - High"]);
    matrix.sortCriteria = [{ field: "added", direction: "desc" }];
    expect(cellState(header(matrix, "added")), "#2").toEqual(["desc", "icon-arrowdown-16x16", "descending", "Newest first"]);
    expect(cellState(header(matrix, "price")), "#3").toEqual([undefined, "icon-sort-16x16", undefined, undefined]);
  });
  test("a cell that survives reads the current state: a direction flipped from code", () => {
    const matrix = createMatrix();
    matrix.sort("price", "desc");
    const price = header(matrix, "price");
    matrix.sortCriteria[0].direction = "asc";
    expect(cellState(price), "#1").toEqual(["asc", "icon-arrowup-16x16", "ascending", "Low - High"]);
  });
  const testLocale = "sort-test";
  afterEach(() => { delete surveyLocalization.locales[testLocale]; });
  test("a locale change updates the tooltip and the accessible name of a cell that survives", () => {
    surveyLocalization.locales[testLocale] = {
      sortByColumnText: "Order by {0}", sortHighLowText: "Big first", sortOrderText: "Ordered: {0}"
    };
    const matrix = createMatrix();
    matrix.sort("price", "desc");
    const price = header(matrix, "price");
    expect([price.sortTooltip, price.sortAriaLabel, price.sortDescription], "#1").toEqual(
      ["High - Low", "Sort by price", "Sorted by price (High - Low)"]);
    matrix.survey.locale = testLocale;
    expect([price.sortTooltip, price.sortAriaLabel, price.sortDescription], "#2").toEqual(
      ["Big first", "Order by price", "Ordered: price (Big first)"]);
  });
});

describe("Sortable headers: a fixed matrix", () => {
  test("the column headers sort the rows", () => {
    const survey = new SurveyModel({ elements: [{
      type: "matrixdropdown", name: "matrix", allowSort: true, rows: ["r1", "r2", "r3"], columns: [{ name: "price", cellType: "text", inputType: "number" }]
    }] });
    survey.data = { matrix: { r1: { price: 2 }, r2: { price: 3 }, r3: { price: 1 } } };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    const cell = header(matrix, "price");
    expect(cell.isSortable, "#1").toBe(true);
    expect(headerCells(matrix).filter((c: QuestionMatrixDropdownRenderedCell): boolean => !c.column)
      .map((c: QuestionMatrixDropdownRenderedCell): boolean => c.isSortable), "#2: the row title header").toEqual([false]);
    cell.toggleSort();
    expect(matrix.visibleRows.map((row: any): string => row.rowName), "#3").toEqual(["r2", "r1", "r3"]);
  });
});
