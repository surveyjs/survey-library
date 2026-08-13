import { settings } from "../settings";
import { SurveyModel } from "../survey";
import { ISurveyTest, ISurveyTestOptions, RESERVED_TARGET_SURVEY } from "./test-json";
import { ISurveyTestCheckResult, ISurveyTestIssue, ISurveyTestStepResult, SurveyTestIssueCodes, SurveyTestSeverity } from "./test-result";

export type SurveyTestTargetKind = "survey" | "question" | "panel" | "page" | "calculatedValue";

export interface ISurveyTestTarget {
  // The target name as written in the case, the whole path included.
  name: string;
  kind: SurveyTestTargetKind;
  // SurveyModel | Question | PanelModel | PageModel | CalculatedValue.
  obj: any;
}

export interface ISurveyTestContext {
  readonly survey: SurveyModel;
  readonly options: ISurveyTestOptions;
  readonly test: ISurveyTest;
  // The index of the step being executed; -1 outside a step.
  readonly stepIndex: number;
  // Throws SurveyTestCaseError when the name resolves to nothing.
  resolveTarget(name: string): ISurveyTestTarget;
  addIssue(issue: ISurveyTestIssue): void;
  addWarning(code: string, message: string, data?: any): void;
  // Appended to the checks of the current step.
  addCheckResult(result: ISurveyTestCheckResult): void;
}

// The only control-flow exception of the tester. The runner catches it, records the issue it carries
// and ends the current test with the status "error". Nothing else may throw across a step boundary.
export class SurveyTestCaseError extends Error {
  constructor(public issue: ISurveyTestIssue) {
    super(issue.message);
    Object.setPrototypeOf(this, SurveyTestCaseError.prototype);
    this.name = "SurveyTestCaseError";
  }
}

export function createCaseError(code: string, message: string,
  props?: { target?: string, data?: any, suggestion?: string }): SurveyTestCaseError {
  const issue: ISurveyTestIssue = { severity: "error", code: code, message: message };
  if (!!props) {
    if (props.target !== undefined) issue.target = props.target;
    if (props.data !== undefined) issue.data = props.data;
    if (props.suggestion !== undefined) issue.suggestion = props.suggestion;
  }
  return new SurveyTestCaseError(issue);
}

export const DEFAULT_TEST_NOW = "2024-01-01T00:00:00";
export const DEFAULT_TEST_RANDOM_SEED = 1;
// The createDate() reasons that mean "the current moment". Any creation with no input value means it
// as well, whatever its reason is.
const NOW_REASONS = ["function-today", "function-currentDate", "function-currentYear"];

interface IPathSegment {
  name: string;
  index?: number;
}

export class SurveyTestContext implements ISurveyTestContext {
  private surveyValue: SurveyModel;
  private targetCache: { [path: string]: ISurveyTestTarget } = {};
  private prevOnDateCreated: any;
  private isDateHookInstalled: boolean = false;
  private currentStep: ISurveyTestStepResult;
  private resetCacheFunc: () => void;

  // testIssues is the issues array of the test result: issues raised outside a step land there.
  constructor(private definition: any, public readonly options: ISurveyTestOptions,
    public readonly test: ISurveyTest, private testIssues: Array<ISurveyTestIssue>) {
  }
  public get survey(): SurveyModel {
    return this.surveyValue;
  }
  public get stepIndex(): number {
    return !!this.currentStep ? this.currentStep.index : -1;
  }
  // The environment is installed before the model is created: a defaultValueExpression calling
  // today() runs while the survey is being built.
  public setup(): void {
    this.installDateHook();
    const survey = new SurveyModel(this.definition);
    this.surveyValue = survey;
    const options = this.options;
    if (options.locale !== undefined) survey.locale = options.locale;
    if (options.clearInvisibleValues !== undefined) survey.clearInvisibleValues = options.clearInvisibleValues;
    if (options.checkErrorsMode !== undefined) survey.checkErrorsMode = options.checkErrorsMode;
    survey.randomSeed = options.randomSeed !== undefined ? options.randomSeed : DEFAULT_TEST_RANDOM_SEED;
    this.subscribeToModelChanges();
  }
  public teardown(): void {
    this.unsubscribeFromModelChanges();
    if (this.isDateHookInstalled) {
      // Restore the previous hook exactly, including undefined.
      settings.onDateCreated = this.prevOnDateCreated;
      this.isDateHookInstalled = false;
    }
    this.targetCache = {};
    this.currentStep = undefined;
  }
  public setCurrentStep(step: ISurveyTestStepResult): void {
    this.currentStep = step;
  }
  // "survey" means the survey itself and nothing else. An element carrying that name would make every
  // case that uses it mean two things, so the test does not run at all.
  public checkReservedTargetName(): void {
    const survey = this.survey;
    const name = RESERVED_TARGET_SURVEY;
    let kind = "";
    if (!!survey.getQuestionByName(name)) kind = "question";
    else if (!!survey.getPanelByName(name)) kind = "panel";
    else if (!!survey.getPageByName(name)) kind = "page";
    if (!kind) return;
    throw createCaseError(SurveyTestIssueCodes.reservedTargetName,
      "The survey contains a " + kind + " named \"" + name + "\", but \"" + name +
      "\" is the reserved target name that means the survey itself. Rename the " + kind + ".",
      { target: name, data: { kind: kind } });
  }
  public resolveTarget(name: string): ISurveyTestTarget {
    const cached = this.targetCache[name];
    if (!!cached) return cached;
    const target = this.resolveTargetCore(name);
    if (this.canCache(name)) {
      this.targetCache[name] = target;
    }
    return target;
  }
  public addIssue(issue: ISurveyTestIssue): void {
    if (!!this.currentStep) {
      if (issue.step === undefined) issue.step = this.currentStep.index;
      this.currentStep.issues.push(issue);
    } else {
      this.testIssues.push(issue);
    }
  }
  public addWarning(code: string, message: string, data?: any): void {
    const issue: ISurveyTestIssue = { severity: <SurveyTestSeverity>"warning", code: code, message: message };
    if (data !== undefined) issue.data = data;
    this.addIssue(issue);
  }
  public addCheckResult(result: ISurveyTestCheckResult): void {
    if (!!this.currentStep) {
      this.currentStep.checks.push(result);
    }
  }
  private installDateHook(): void {
    const nowStr = !!this.options.now ? this.options.now : DEFAULT_TEST_NOW;
    let time = Date.parse(nowStr);
    // An unparsable "now" falls back to the default: pinning the machine clock instead would make the
    // whole run non-reproducible, which is the one thing this hook exists to prevent.
    if (isNaN(time)) time = Date.parse(DEFAULT_TEST_NOW);
    const prevHook = settings.onDateCreated;
    this.prevOnDateCreated = prevHook;
    this.isDateHookInstalled = true;
    settings.onDateCreated = (newDate: Date, reason: string, val?: number | string | Date): Date => {
      const res = !!prevHook ? prevHook(newDate, reason, val) : newDate;
      if (!val || NOW_REASONS.indexOf(reason) > -1) {
        // The date instance comes from createDate(): the tester repins it instead of creating its own,
        // so no tester code calls new Date().
        res.setTime(time);
      }
      return res;
    };
  }
  private subscribeToModelChanges(): void {
    const survey = this.survey;
    this.resetCacheFunc = () => { this.targetCache = {}; };
    survey.onCurrentPageChanged.add(this.resetCacheFunc);
    survey.onDynamicPanelAdded.add(this.resetCacheFunc);
    survey.onDynamicPanelRemoved.add(this.resetCacheFunc);
    survey.onMatrixRowAdded.add(this.resetCacheFunc);
    survey.onMatrixRowRemoved.add(this.resetCacheFunc);
  }
  private unsubscribeFromModelChanges(): void {
    const survey = this.surveyValue;
    if (!survey || !this.resetCacheFunc) return;
    survey.onCurrentPageChanged.remove(this.resetCacheFunc);
    survey.onDynamicPanelAdded.remove(this.resetCacheFunc);
    survey.onDynamicPanelRemoved.remove(this.resetCacheFunc);
    survey.onMatrixRowAdded.remove(this.resetCacheFunc);
    survey.onMatrixRowRemoved.remove(this.resetCacheFunc);
    this.resetCacheFunc = undefined;
  }
  // Only a plain top-level name is cached. A path into a dynamic panel or a matrix resolves to an
  // object the model rebuilds on its own schedule, and handing out a stale question is worse than
  // resolving it again. The cache is dropped on a page change and on a row/panel change anyway.
  private canCache(name: string): boolean {
    return name.indexOf(".") < 0 && name.indexOf("[") < 0;
  }
  private resolveTargetCore(path: string): ISurveyTestTarget {
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
        const indexed = this.resolveIndex(path, current, segment, next, segments, i);
        current = indexed.target;
        if (indexed.consumedNext) i++;
      }
    }
    return current;
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
    const survey = this.survey;
    const found: Array<ISurveyTestTarget> = [];
    const addFound = (obj: any, kind: SurveyTestTargetKind): void => {
      if (!!obj) found.push({ name: path, kind: kind, obj: obj });
    };
    addFound(survey.getQuestionByName(segment.name), "question");
    addFound(survey.getPanelByName(segment.name), "panel");
    addFound(survey.getPageByName(segment.name), "page");
    addFound(survey.getCalculatedValueByName(segment.name), "calculatedValue");
    if (found.length === 0) {
      throw this.createUnknownTargetError(path, segment.name, "");
    }
    if (found.length > 1) {
      const kinds = found.map(target => target.kind);
      this.addWarning(SurveyTestIssueCodes.ambiguousTarget,
        "The survey contains several elements named \"" + segment.name + "\": " + kinds.join(", ") +
        ". The test uses the " + found[0].kind + ".",
        { name: segment.name, kinds: kinds });
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
    const row = this.findRowByName(obj, segment.name);
    if (!!row) return { name: path, kind: this.getContainerKind(), obj: row };
    throw this.createUnknownTargetError(path, segment.name, this.getPathPrefix(segments, index));
  }
  private resolveIndex(path: string, parent: ISurveyTestTarget, segment: IPathSegment,
    next: IPathSegment, segments: Array<IPathSegment>, index: number):
    { target: ISurveyTestTarget, consumedNext: boolean } {
    const obj: any = parent.obj;
    const children = this.getIndexedChildren(obj);
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
    return { target: { name: path, kind: this.getContainerKind(), obj: children[segment.index] }, consumedNext: false };
  }
  private getIndexedChildren(obj: any): Array<any> {
    if (!obj) return undefined;
    if (Array.isArray(obj.panels)) return obj.panels;
    if (Array.isArray(obj.visibleRows)) return obj.visibleRows;
    return undefined;
  }
  private findRowByName(obj: any, name: string): any {
    if (!obj || !Array.isArray(obj.visibleRows)) return undefined;
    const rows = obj.visibleRows;
    for (let i = 0; i < rows.length; i++) {
      const rowName = rows[i].rowName;
      if (rowName !== undefined && rowName !== null && String(rowName) === name) return rows[i];
    }
    return undefined;
  }
  // A panel of a dynamic panel and a row of a matrix are both containers of questions. The target
  // kinds are fixed by the format and there is no "row" among them, so a row reports itself as a
  // panel - it is the kind a check written for a container expects.
  private getContainerKind(): SurveyTestTargetKind {
    return "panel";
  }
  private getPathPrefix(segments: Array<IPathSegment>, index: number): string {
    const res: Array<string> = [];
    for (let i = 0; i < index; i++) {
      const segment = segments[i];
      res.push(segment.index === undefined ? segment.name : segment.name + "[" + segment.index + "]");
    }
    return res.join(".");
  }
  private createUnknownTargetError(path: string, segment: string, prefix: string): SurveyTestCaseError {
    const where = !!prefix ? " inside \"" + prefix + "\"" : " in the survey";
    return createCaseError(SurveyTestIssueCodes.unknownTarget,
      "The target \"" + path + "\" cannot be resolved: there is no \"" + segment + "\"" + where + ".",
      { target: path, data: { segment: segment, prefix: prefix } });
  }
  private createMalformedPathError(path: string): SurveyTestCaseError {
    return createCaseError(SurveyTestIssueCodes.unknownTarget,
      "The target \"" + path + "\" is not a valid target path. A path is a name, or several names separated by \".\", where a name may carry an index: \"panel[0].question\".",
      { target: path });
  }
}
