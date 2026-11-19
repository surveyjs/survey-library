import { SurveyModel, QuestionMatrixDynamicModel, settings } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, afterEach, beforeEach } from "vitest";

const containers: Array<HTMLElement> = [];
function mount(element: React.JSX.Element): HTMLElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  containers.push(container);
  act(() => {
    ReactDOM.render(element, container);
  });
  return container;
}
let prevAnimationEnabled: boolean;
beforeEach(() => {
  prevAnimationEnabled = settings.animationEnabled;
  settings.animationEnabled = false;
});
afterEach(() => {
  containers.splice(0).forEach(container => {
    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    container.remove();
  });
  settings.animationEnabled = prevAnimationEnabled;
});

// The DOM nodes that the vnodes reachable from the container still point to while the nodes are out of the document:
// what a heap snapshot shows as detached DOM kept by the rendered tree. Preact 10 mangles its vnode fields: __k is
// _children, __ is _parent, __e is _dom, __c is _component; a component's __v is its current vnode.
function detachedDomInVNodes(container: HTMLElement): number {
  const seen = new Set<any>();
  const detached = new Set<Node>();
  const visit = (item: any): void => {
    if (!item || typeof item !== "object" || seen.has(item)) return;
    seen.add(item);
    if (Array.isArray(item)) {
      item.forEach(visit);
      return;
    }
    if (!("type" in item) || !item.props) return;
    const dom: Node = item.__e;
    if (!!dom && !dom.isConnected) detached.add(dom);
    visit(item.__k);
    visit(item.__);
    visit(item.props.children);
    if (!!item.__c) visit(item.__c.__v);
  };
  visit((container as any).__k);
  return detached.size;
}

class Child extends React.Component<any, { count: number, shown: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { count: 0, shown: true };
  }
  render(): React.JSX.Element {
    return <p data-count={this.state.count}>{this.state.shown ? <span>text</span> : null}</p>;
  }
}
// Renders its child once and never again: the div's props.children keeps the child's first vnode.
class Parent extends React.Component<{ childRef: React.RefObject<Child> }, any> {
  render(): React.JSX.Element {
    return <div><Child ref={this.props.childRef} /></div>;
  }
}

describe("A vnode that a component's own re-render replaces", () => {
  it("does not keep the subtree it rendered", () => {
    const childRef = React.createRef<Child>();
    const container = mount(<Parent childRef={childRef} />);
    const span = container.querySelector("span");
    expect(!!span, "the span is rendered").toBe(true);

    act(() => { childRef.current.setState({ count: 1 }); });
    act(() => { childRef.current.setState({ shown: false }); });
    expect(container.querySelector("span"), "the span is removed").toBeNull();
    expect(span.isConnected, "the span is out of the document").toBe(false);
    expect(detachedDomInVNodes(container), "no vnode keeps a detached node").toBe(0);
  });
});

describe("Sorting a matrix whose rows are rebound", () => {
  // The orders matrix of the perf fixture records, cut down: an expression cell recalculated for the record a row
  // shows, a cell shown for the larger totals only, a comment cell.
  function createSurvey(): SurveyModel {
    const orders: Array<any> = [];
    for (let i = 0; i < 60; i++) {
      const qty = i % 7 + 1;
      const price = (i * 37) % 30 + 1;
      orders.push({ id: "r" + (100 + i), qty: qty, price: price, total: qty * price, note: i % 3 === 0 ? "note " + i : undefined });
    }
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "orders", rowCount: 0, pageSize: 20, allowSort: true,
        columns: [
          { name: "id", cellType: "text" },
          { name: "qty", cellType: "text", inputType: "number" },
          { name: "price", cellType: "text", inputType: "number" },
          { name: "total", cellType: "expression", expression: "{row.qty} * {row.price}" },
          { name: "discount", cellType: "text", visibleIf: "{row.total} > 60" },
          { name: "note", cellType: "comment" }
        ]
      }]
    });
    survey.data = { orders: orders };
    return survey;
  }
  // The cycle of the perf scenario records-10k/records/sort-header@orders: the sort reset to total desc, cleared, then
  // a click on the sort button of total, an expression column, which sorts ascending.
  function sortCycle(container: HTMLElement, matrix: QuestionMatrixDynamicModel): void {
    act(() => { matrix.sortCriteria = [{ field: "total", direction: "desc" }]; });
    act(() => { matrix.sortCriteria = []; });
    const index = matrix.renderedTable.headerRow.cells.map(cell => cell.column && cell.column.name).indexOf("total");
    const button = container.querySelector("thead th:nth-child(" + (index + 1) + ") button.sd-table__header-sort-button") as HTMLElement;
    expect(!!button, "the sort button of total").toBe(true);
    act(() => { button.click(); });
    expect(matrix.sortCriteria.map(c => c.field + " " + c.direction), "sorted by the click").toEqual(["total asc"]);
  }
  it("does not keep the detached cells reachable from the rendered tree", () => {
    const survey = createSurvey();
    const matrix = survey.getQuestionByName("orders") as QuestionMatrixDynamicModel;
    const container = mount(<SurveyReact model={survey} />);
    expect(matrix.visibleRows.length, "a page of rows").toBe(20);
    const firstRow = matrix.visibleRows[0];

    sortCycle(container, matrix);
    expect(matrix.visibleRows[0], "the rows are rebound, not rebuilt").toBe(firstRow);
    const afterFirst = detachedDomInVNodes(container);
    sortCycle(container, matrix);
    sortCycle(container, matrix);
    expect(detachedDomInVNodes(container), "the detached nodes do not grow with the cycles").toBe(afterFirst);
    expect(afterFirst, "no detached node is kept").toBe(0);
    survey.dispose();
  });
});
