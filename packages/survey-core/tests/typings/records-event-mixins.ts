// A compile-time fixture, not a unit test: vitest does not type-check, so `npm run test:types` compiles
// this file. Each survey event about a matrix row or a dynamic panel takes getRecord from the shared
// base (prompt 05): a mixin dropped from one of them fails the compile.
import type {
  MatrixRowEventMixin, DynamicPanelEventMixin, RecordEventMixin, MatrixRowAddedEvent, MatrixRowRemovingEvent,
  MatrixRowRemovedEvent, MatrixAllowRemoveRowEvent, MatrixDetailPanelVisibleChangedEvent, MatrixCellCreatingEvent,
  MatrixCellCreatedEvent, MatrixAfterCellRenderEvent, MatrixCellValueChangedEvent, MatrixCellValueChangingEvent,
  MatrixCellValidateEvent, GetMatrixRowActionsEvent, MatrixRowDragOverEvent, DynamicPanelModifiedEvent,
  DynamicPanelRemovingEvent, DynamicPanelValueChangedEvent, DynamicPanelValueChangingEvent,
  DynamicPanelItemValueChangedEvent, DynamicPanelCurrentIndexChangedEvent, DynamicPanelGetTabTitleEvent,
  UpdateMatrixCellCssEvent, UpdateMatrixRowCssEvent
} from "../../src/survey-events-api";
import type { MatrixDropdownRowModelBase } from "../../src/question_matrixdropdownbase";
import type { QuestionRecordItem } from "../../src/question_records";

type Extends<A, B> = A extends B ? true : false;
export const rowEvents: Array<true> = [
  <Extends<MatrixRowAddedEvent, MatrixRowEventMixin>>true, <Extends<MatrixRowRemovingEvent, MatrixRowEventMixin>>true,
  <Extends<MatrixRowRemovedEvent, MatrixRowEventMixin>>true, <Extends<MatrixAllowRemoveRowEvent, MatrixRowEventMixin>>true,
  <Extends<MatrixDetailPanelVisibleChangedEvent, MatrixRowEventMixin>>true, <Extends<MatrixCellCreatingEvent, MatrixRowEventMixin>>true,
  <Extends<MatrixCellCreatedEvent, MatrixRowEventMixin>>true, <Extends<MatrixAfterCellRenderEvent, MatrixRowEventMixin>>true,
  <Extends<MatrixCellValueChangedEvent, MatrixRowEventMixin>>true, <Extends<MatrixCellValueChangingEvent, MatrixRowEventMixin>>true,
  <Extends<MatrixCellValidateEvent, MatrixRowEventMixin>>true, <Extends<GetMatrixRowActionsEvent, MatrixRowEventMixin>>true,
  <Extends<MatrixRowDragOverEvent, MatrixRowEventMixin>>true, <Extends<UpdateMatrixCellCssEvent, MatrixRowEventMixin>>true,
  <Extends<UpdateMatrixRowCssEvent, MatrixRowEventMixin>>true
];
export const panelEvents: Array<true> = [
  <Extends<DynamicPanelModifiedEvent, DynamicPanelEventMixin>>true, <Extends<DynamicPanelRemovingEvent, DynamicPanelEventMixin>>true,
  <Extends<DynamicPanelValueChangedEvent, DynamicPanelEventMixin>>true, <Extends<DynamicPanelValueChangingEvent, DynamicPanelEventMixin>>true,
  <Extends<DynamicPanelItemValueChangedEvent, DynamicPanelEventMixin>>true, <Extends<DynamicPanelCurrentIndexChangedEvent, DynamicPanelEventMixin>>true,
  <Extends<DynamicPanelGetTabTitleEvent, DynamicPanelEventMixin>>true
];
// An event's getter, a row and a dynamic panel's item answer the same call.
export const getRecordOfEvent = (options: RecordEventMixin): any => options.getRecord();
export const getRecordOfRow = (row: MatrixDropdownRowModelBase): any => row.getRecord();
export const getRecordOfItem = (item: QuestionRecordItem): any => item.getRecord();
