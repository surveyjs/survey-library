import type { SurveyModel } from "survey-core";
import { getClosestName, getSurveyNames } from "./test-diagnostics";
import { createCaseError, SurveyTestCaseError } from "./test-error";
import { RESERVED_TARGET_SURVEY } from "./test-json";
import { SurveyTestIssueCodes } from "./test-result";

// The target grammar of the tester, in both directions and in one place. A case addresses an element
// by a path - "contacts[0].items[1].price" - and the runner resolves that path to a live model object;
// a recorder or a test generator starts from the live object and needs the path that addresses it.
// The two directions are the same grammar, so they share these helpers: a rule that changed on one
// side only would let a recorder write cases the runner cannot run.

const TARGET_KINDS = ["survey", "question", "panel", "page", "calculatedValue"] as const;
export type SurveyTestTargetKind = typeof TARGET_KINDS[number];
// The runtime form of the union, for a UI that enumerates the kinds. Derived from the declaration
// above and frozen: there is one list, and a host cannot edit it.
export const SurveyTestTargetKinds: ReadonlyArray<SurveyTestTargetKind> = Object.freeze(TARGET_KINDS.slice());

export interface ISurveyTestTarget {
  // The target name as written in the case, the whole path included.
  name: string;
  kind: SurveyTestTargetKind;
  // SurveyModel | Question | PanelModel | PageModel | CalculatedValue.
  obj: any;
}

// Reported when a plain name addresses more than one element. The resolver takes the first match and
// tells whoever is listening; nothing here decides what to do about it.
export type SurveyTestAmbiguityHandler = (name: string, kinds: Array<SurveyTestTargetKind>) => void;

// Row context for the inverse direction. A matrix renderer event hands a cell over together with the
// row and the matrix it belongs to, and there are objects - a row of a matrix whose rows hold no back
// reference, a cell whose name repeats in a detail panel - the row of which cannot be recovered from
// the object alone. It is a fallback: whatever can be found from the object itself wins.
export interface ISurveyTestTargetContext {
  matrix?: any;
  row?: any;
}

interface IPathSegment {
  name: string;
  index?: number;
}

// A path is a chain of containers, not a recursion: the ceiling only stops a cycle in a broken model
// from hanging the caller.
const MAX_TARGET_DEPTH = 20;

// Exported for the check and the command registries: the tester duck-types a question type in one
// place, so that "panelCount", "addPanel" and the path of a panel can never disagree about what a
// dynamic panel is.
export function isDynamicPanelQuestion(question: any): boolean {
  return !!question && typeof question.addPanel === "function" && Array.isArray(question.panels);
}
export function isDynamicMatrixQuestion(question: any): boolean {
  return !!question && typeof question.addRow === "function" && Array.isArray(question.visibleRows) &&
    typeof question.rowCount === "number";
}

// A panel of a dynamic panel and a row of a matrix are both containers of questions. The target kinds
// are fixed by the format and there is no "row" among them, so a row reports itself as a panel - it is
// the kind a check written for a container expects.
export function getContainerTargetKind(): SurveyTestTargetKind {
  return "panel";
}

// What an index addresses: the panels of a dynamic panel, or the rows of a matrix.
export function getIndexedChildren(obj: any): Array<any> {
  if (!obj) return undefined;
  if (Array.isArray(obj.panels)) return obj.panels;
  if (Array.isArray(obj.visibleRows)) return obj.visibleRows;
  return undefined;
}

export function findRowByName(obj: any, name: string): any {
  if (!obj || !Array.isArray(obj.visibleRows)) return undefined;
  const rows = obj.visibleRows;
  for (let i = 0; i < rows.length; i++) {
    if (getRowName(rows[i]) === name) return rows[i];
  }
  return undefined;
}

// How a row of this matrix is written in a path. A dynamic matrix has no row names a case could rely
// on - a row is created by the respondent and names itself after its generated id - so it is addressed
// by position. A matrix with declared rows is addressed by the row name, because there the name is what
// the definition fixes and a row that moves keeps it.
export function getRowSegment(matrix: any, row: any, index: number): string {
  if (isDynamicMatrixQuestion(matrix)) return "[" + index + "]";
  const rowName = getRowName(row);
  return rowName === undefined ? undefined : "." + rowName;
}

function getRowName(row: any): string {
  const name = !!row ? row.rowName : undefined;
  if (name === undefined || name === null || String(name) === "") return undefined;
  return String(name);
}

export function formatPathSegment(segment: IPathSegment): string {
  return segment.index === undefined ? segment.name : segment.name + "[" + segment.index + "]";
}

export class SurveyTestTargetResolver {
  constructor(private survey: SurveyModel, private onAmbiguous?: SurveyTestAmbiguityHandler) {
  }
  // Throws SurveyTestCaseError when the path resolves to nothing.
  public resolve(path: string): ISurveyTestTarget {
    if (path === RESERVED_TARGET_SURVEY) {
      return { name: path, kind: "survey", obj: this.survey };
    }
    const segments = this.parsePath(path);
    let current: ISurveyTestTarget = undefined;
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      current = i === 0
        ? this.resolveRootSegment(path, segment)
        : this.resolveChildSegment(path, current, segment, segments, i);
      if (segment.index !== undefined) {
        const next = i + 1 < segments.length ? segments[i + 1] : undefined;
        const indexed = this.resolveIndex(path, current, segment, next);
        current = indexed.target;
        if (indexed.consumedNext) i++;
      }
    }
    return current;
  }
  // The same resolution without the exception: a caller that is asking whether a path addresses
  // anything is not writing a case error.
  public resolveSafe(path: string): ISurveyTestTarget {
    if (!path || !this.survey) return undefined;
    try {
      return this.resolve(path);
    } catch(e) {
      return undefined;
    }
  }
  // The inverse: the target name that resolves back to this object, or undefined when the public
  // grammar cannot address it. Nothing is retained - neither the object nor the row handed in.
  public nameOf(obj: any, context?: ISurveyTestTargetContext): string | undefined {
    if (!this.survey || !obj) return undefined;
    if (obj === this.survey) return RESERVED_TARGET_SURVEY;
    const path = this.buildPath(obj, context);
    if (!path) return undefined;
    // The round trip is the contract. A path is returned only when resolving it in this survey gives
    // back the very object it was built for, so a name that happens to address another element with
    // the same name is not reported as a target of this one.
    const target = this.resolveSafe(path);
    return !!target && target.obj === obj ? path : undefined;
  }
  private buildPath(obj: any, context: ISurveyTestTargetContext): string {
    const type = typeof obj.getType === "function" ? obj.getType() : "";
    if (type === "page" || type === "calculatedvalue") return this.getOwnName(obj);
    if (type === "panel") {
      // A panel is addressed by its plain name, and only survey.getPanelByName can find it: a panel
      // inside a matrix detail panel is not among them, and a panel of a dynamic panel is addressed
      // by the index of the dynamic panel instead.
      return !obj.parentQuestion ? this.getOwnName(obj) : this.buildDynamicPanelPath(obj);
    }
    if (this.isRow(obj, context)) return this.buildRowPath(obj, context);
    // Everything else the grammar knows is a question, and a question has a type.
    return !!type ? this.buildQuestionPath(obj, context) : undefined;
  }
  private getOwnName(obj: any): string {
    return typeof obj.name === "string" && !!obj.name ? obj.name : undefined;
  }
  private buildQuestionPath(question: any, context: ISurveyTestTargetContext): string {
    let path = this.getOwnName(question);
    if (!path) return undefined;
    let current = question;
    for (let depth = 0; depth < MAX_TARGET_DEPTH; depth++) {
      const parent = current.parentQuestion;
      if (!parent) return path;
      const parentName = this.getOwnName(parent);
      const segment = !!parentName ? this.getContainerSegment(parent, current, context) : undefined;
      // A container the grammar cannot address at all: the object has no target name rather than one
      // that would end a case with unknownTarget.
      if (segment === undefined) return undefined;
      path = parentName + segment + "." + path;
      current = parent;
    }
    return undefined;
  }
  private buildDynamicPanelPath(panel: any): string {
    const parent = panel.parentQuestion;
    if (!isDynamicPanelQuestion(parent)) return undefined;
    const index = parent.panels.indexOf(panel);
    if (index < 0) return undefined;
    const parentPath = this.buildQuestionPath(parent, undefined);
    return !!parentPath ? parentPath + "[" + index + "]" : undefined;
  }
  private buildRowPath(row: any, context: ISurveyTestTargetContext): string {
    const matrix = this.getRowMatrix(row, context);
    if (!matrix) return undefined;
    const index = matrix.visibleRows.indexOf(row);
    if (index < 0) return undefined;
    const segment = getRowSegment(matrix, row, index);
    if (segment === undefined) return undefined;
    // The matrix is the object the row hangs off; the context describes this row, not the matrix.
    const matrixPath = this.buildQuestionPath(matrix, undefined);
    return !!matrixPath ? matrixPath + segment : undefined;
  }
  private isRow(obj: any, context: ISurveyTestTargetContext): boolean {
    if (!!context && !!context.row && context.row === obj) return true;
    // A row of a matrix identifies itself, exactly as every element does: it is neither a question
    // nor a panel, and it is the one container the grammar addresses that is not a survey element.
    return typeof obj.getType === "function" && obj.getType() === "matrixrow";
  }
  private getRowMatrix(row: any, context: ISurveyTestTargetContext): any {
    // "data" is the matrix that built the row. A row handed over by a renderer event carries its
    // matrix with it, and that is used when the row does not name its own.
    const candidates = [!!context ? context.matrix : undefined, row.data];
    for (let i = 0; i < candidates.length; i++) {
      const matrix = candidates[i];
      if (!!matrix && Array.isArray(matrix.visibleRows) && matrix.visibleRows.indexOf(row) > -1) return matrix;
    }
    return undefined;
  }
  private getContainerSegment(parent: any, child: any, context: ISurveyTestTargetContext): string {
    if (isDynamicPanelQuestion(parent)) {
      const index = this.getPanelIndexOf(parent.panels, child);
      return index < 0 ? undefined : "[" + index + "]";
    }
    if (Array.isArray(parent.visibleRows)) {
      const rows: Array<any> = parent.visibleRows;
      let index = this.getRowIndexOf(rows, child);
      // Only when the object cannot say which row it belongs to: the row a renderer event handed over.
      if (index < 0 && !!context && !!context.row && (!context.matrix || context.matrix === parent)) {
        index = rows.indexOf(context.row);
      }
      return index < 0 ? undefined : getRowSegment(parent, rows[index], index);
    }
    return undefined;
  }
  private getPanelIndexOf(panels: Array<any>, child: any): number {
    // The question may sit in a static panel inside the panel of the dynamic panel, so the parent
    // chain is walked until one of the panels of the dynamic panel is reached.
    let node = child.parent;
    for (let depth = 0; depth < MAX_TARGET_DEPTH && !!node; depth++) {
      const index = panels.indexOf(node);
      if (index > -1) return index;
      node = node.parent;
    }
    return -1;
  }
  private getRowIndexOf(rows: Array<any>, question: any): number {
    for (let i = 0; i < rows.length; i++) {
      if (this.rowContains(rows[i], question)) return i;
    }
    return -1;
  }
  private rowContains(row: any, question: any): boolean {
    if (!row) return false;
    if (Array.isArray(row.cells) && row.cells.some((cell: any) => !!cell && cell.question === question)) return true;
    // A question of the detail panel of a row answers getQuestionByName as well, and the resolver
    // reaches it through the same call.
    const name = typeof question.name === "string" ? question.name : "";
    return !!name && typeof row.getQuestionByName === "function" && row.getQuestionByName(name) === question;
  }
  private parsePath(path: string): Array<IPathSegment> {
    const res: Array<IPathSegment> = [];
    const parts = typeof path === "string" ? path.split(".") : [];
    if (parts.length === 0 || !path) throw this.createMalformedPathError(path);
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const bracket = part.indexOf("[");
      if (bracket < 0) {
        if (!part || part.indexOf("]") > -1) throw this.createMalformedPathError(path);
        res.push({ name: part });
        continue;
      }
      const name = part.substring(0, bracket);
      const indexStr = part.substring(bracket + 1, part.length - 1);
      if (!name || part[part.length - 1] !== "]" || !/^\d+$/.test(indexStr)) {
        throw this.createMalformedPathError(path);
      }
      res.push({ name: name, index: parseInt(indexStr, 10) });
    }
    return res;
  }
  private resolveRootSegment(path: string, segment: IPathSegment): ISurveyTestTarget {
    const survey: any = this.survey;
    const found: Array<ISurveyTestTarget> = [];
    const addFound = (obj: any, kind: SurveyTestTargetKind): void => {
      if (!!obj) found.push({ name: path, kind: kind, obj: obj });
    };
    addFound(survey.getQuestionByName(segment.name), "question");
    addFound(survey.getPanelByName(segment.name), "panel");
    addFound(survey.getPageByName(segment.name), "page");
    addFound(survey.getCalculatedValueByName(segment.name), "calculatedValue");
    if (found.length === 0) {
      throw this.createUnknownTargetError(path, segment.name, "", getSurveyNames(survey));
    }
    if (found.length > 1 && !!this.onAmbiguous) {
      this.onAmbiguous(segment.name, found.map(target => target.kind));
    }
    return found[0];
  }
  private resolveChildSegment(path: string, parent: ISurveyTestTarget, segment: IPathSegment,
    segments: Array<IPathSegment>, index: number): ISurveyTestTarget {
    const obj: any = parent.obj;
    // A page, a panel and a matrix row all answer getQuestionByName; a matrix row answers it for its
    // cells and its detail panel. The tester duck-types instead of importing the question classes so
    // that the separate tester bundle does not pull them in.
    if (!!obj && typeof obj.getQuestionByName === "function") {
      const question = obj.getQuestionByName(segment.name);
      if (!!question) return { name: path, kind: "question", obj: question };
    }
    const row = findRowByName(obj, segment.name);
    if (!!row) return { name: path, kind: getContainerTargetKind(), obj: row };
    throw this.createUnknownTargetError(path, segment.name, this.getPathPrefix(segments, index),
      this.getChildNames(obj));
  }
  private getChildNames(obj: any): Array<string> {
    const res: Array<string> = [];
    if (!obj) return res;
    if (Array.isArray(obj.questions)) {
      obj.questions.forEach((question: any) => res.push(question.name));
    }
    if (Array.isArray(obj.visibleRows)) {
      obj.visibleRows.forEach((row: any) => {
        const name = getRowName(row);
        if (name !== undefined) res.push(name);
      });
    }
    return res;
  }
  private resolveIndex(path: string, parent: ISurveyTestTarget, segment: IPathSegment, next: IPathSegment):
    { target: ISurveyTestTarget, consumedNext: boolean } {
    const obj: any = parent.obj;
    const children = getIndexedChildren(obj);
    if (!children) {
      throw createCaseError(SurveyTestIssueCodes.unknownTarget,
        "The target \"" + path + "\" applies an index to \"" + segment.name +
        "\", but this element has no indexed children. An index addresses a panel of a dynamic panel or a row of a dynamic matrix.",
        { target: path, data: { segment: segment.name } });
    }
    if (segment.index < 0 || segment.index >= children.length) {
      throw createCaseError(SurveyTestIssueCodes.unknownTarget,
        "The target \"" + path + "\" uses the index " + segment.index + " of \"" + segment.name +
        "\", but it has " + children.length + " item(s).",
        { target: path, data: { segment: segment.name, index: segment.index, count: children.length } });
    }
    if (!!next && next.index === undefined && !!obj && typeof obj.getQuestionFromArray === "function") {
      const question = obj.getQuestionFromArray(next.name, segment.index);
      if (!!question) return { target: { name: path, kind: "question", obj: question }, consumedNext: true };
    }
    return {
      target: { name: path, kind: getContainerTargetKind(), obj: children[segment.index] },
      consumedNext: false,
    };
  }
  private getPathPrefix(segments: Array<IPathSegment>, index: number): string {
    const res: Array<string> = [];
    for (let i = 0; i < index; i++) {
      res.push(formatPathSegment(segments[i]));
    }
    return res.join(".");
  }
  private createUnknownTargetError(path: string, segment: string, prefix: string,
    candidates: Array<string>): SurveyTestCaseError {
    const where = !!prefix ? " inside \"" + prefix + "\"" : " in the survey";
    const props: any = { target: path, data: { segment: segment, prefix: prefix } };
    const closest = getClosestName(segment, candidates);
    if (!!closest) props.suggestion = "Did you mean \"" + closest + "\"?";
    return createCaseError(SurveyTestIssueCodes.unknownTarget,
      "The target \"" + path + "\" cannot be resolved: there is no \"" + segment + "\"" + where + ".", props);
  }
  private createMalformedPathError(path: string): SurveyTestCaseError {
    return createCaseError(SurveyTestIssueCodes.unknownTarget,
      "The target \"" + path + "\" is not a valid target path. A path is a name, or several names separated by \".\", where a name may carry an index: \"panel[0].question\".",
      { target: path });
  }
}

// The public inverse of target resolution, for a recorder, a case editor or a test generator: it takes
// a live survey and an object of it and returns the name a case addresses that object by. Framework
// neutral and stateless - nothing is cached, and neither the survey nor the row handed in is retained.
export class SurveyTestTargets {
  public static nameOf(survey: SurveyModel, obj: any, context?: ISurveyTestTargetContext): string | undefined {
    return new SurveyTestTargetResolver(survey).nameOf(obj, context);
  }
  // The forward direction, without the runner: what the name addresses in this survey, or undefined.
  public static resolve(survey: SurveyModel, name: string): ISurveyTestTarget | undefined {
    return new SurveyTestTargetResolver(survey).resolveSafe(name);
  }
}
