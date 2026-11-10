import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { Question } from "../../src/question";
import { PanelModel } from "../../src/panel";
import { IRecordsPageState } from "../../src/records/records-paging";
import {
  IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource
} from "../../src/dynamic-data/dynamic-data-interfaces";

// The edited set and the page the page validation keeps for a records question have no public face.
export const getPageState = (q: Question): IRecordsPageState => (<any>q).getPageState();
// The current sort of a records question, as plain { field, direction } criteria.
export const getSort = (q: any): Array<any> => q.sortCriteria.map((c: any) => ({ field: c.field, direction: c.direction }));
export const setPageState = (q: Question, state: IRecordsPageState): void => { (<any>q).setPageState(state); };

export async function flush(times: number = 30): Promise<void> {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
  }
}
export function records(count: number, create?: (i: number) => any): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    res.push(!!create ? create(i) : { id: i, name: "n" + i });
  }
  return res;
}
export const panelTemplate = [{ type: "text", name: "id" }, { type: "text", name: "name" }];
export function createPanelSurvey(json: any, data?: Array<any>, extra?: Array<any>): SurveyModel {
  const survey = new SurveyModel({
    elements: [Object.assign({ type: "paneldynamic", name: "pd", templateElements: panelTemplate }, json)].concat(extra || [])
  });
  if (!!data) {
    survey.data = { pd: data };
  }
  return survey;
}
export function createPanel(json: any, data?: Array<any>, extra?: Array<any>): QuestionPanelDynamicModel {
  return <QuestionPanelDynamicModel>createPanelSurvey(json, data, extra).getQuestionByName("pd");
}
export const matrixColumns = [{ name: "id", cellType: "text" }, { name: "name", cellType: "text" }];
export function createMatrixSurvey(json: any, data?: Array<any>, extra?: Array<any>): SurveyModel {
  const survey = new SurveyModel({
    elements: [Object.assign({ type: "matrixdynamic", name: "md", rowCount: 0, columns: matrixColumns }, json)].concat(extra || [])
  });
  if (!!data) {
    survey.data = { md: data };
  }
  return survey;
}
export function createMatrix(json: any, data?: Array<any>, extra?: Array<any>): QuestionMatrixDynamicModel {
  return <QuestionMatrixDynamicModel>createMatrixSurvey(json, data, extra).getQuestionByName("md");
}
export function panelIds(question: QuestionPanelDynamicModel): Array<any> {
  return question.panels.map((panel: PanelModel) => panel.getQuestionByName("id").value);
}
export function rowIds(question: QuestionMatrixDynamicModel): Array<any> {
  return question.visibleRows.map(row => row.getQuestionByName("id").value);
}
// The panels a dynamic panel creates, counted through onQuestionCreated: one "id" question per panel.
// A question attached again is counted once, the template's own question not at all.
export function countCreatedPanels(survey: SurveyModel, name: string = "pd"): () => number {
  const created: Array<Question> = [];
  survey.onQuestionCreated.add((_, options) => {
    const owner = <QuestionPanelDynamicModel>survey.getQuestionByName(name);
    const q = options.question;
    if (q.name === "id" && q.parentQuestion === owner && q.parent !== owner.template && created.indexOf(q) < 0) created.push(q);
  });
  return () => created.length;
}
// The rows a matrix creates, counted through onMatrixCellCreated: one cell of the column per row.
export function countCreatedRows(survey: SurveyModel, columnName: string = "id"): () => number {
  let count = 0;
  survey.onMatrixCellCreated.add((_, options) => { if (options.columnName === columnName) count++; });
  return () => count;
}
export function range(from: number, to: number): Array<number> {
  const res: Array<number> = [];
  for (let i = from; i <= to; i++) res.push(i);
  return res;
}

/* A source that pages itself, the shape a server has: every read is one request with the range. */
// Keyed by "id": a source without keyField is read-only. The records of records() have the id of their position.
export class PagedSource implements IDynamicDataSource {
  public reads: Array<IDynamicDataReadRequest> = [];
  public updates: Array<Array<any>> = [];
  public removes: Array<any> = [];
  public capabilities = { paging: true, filtering: true, sorting: true };
  public keyField = "id";
  constructor(public data: Array<any>, public reportTotal: boolean = true) { }
  public read(request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> {
    this.reads.push(request);
    const take = request.take > 0 ? request.take : this.data.length;
    const res: IDynamicDataReadResult = { records: this.data.slice(request.skip, request.skip + take).map(r => Object.assign({}, r)) };
    if (this.reportTotal) res.total = this.data.length;
    return Promise.resolve(res);
  }
  private indexOfKey(key: any): number {
    return this.data.map(r => r.id).indexOf(key);
  }
  public update(key: any, record: any): Promise<void> {
    this.updates.push([key, record]);
    const at = this.indexOfKey(key);
    if (at > -1)this.data[at] = Object.assign({}, record);
    return Promise.resolve();
  }
  public remove(key: any): Promise<void> {
    this.removes.push(key);
    const at = this.indexOfKey(key);
    if (at > -1)this.data.splice(at, 1);
    return Promise.resolve();
  }
}
