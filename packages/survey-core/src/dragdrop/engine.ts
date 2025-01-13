export interface IDragDropEngine {
  dragInit(event: PointerEvent, draggedElement: any, parentElement: any, draggedElementNode: HTMLElement): void;
  dragOver(event: PointerEvent): void;
  drop(): void;
  clear(): void;
}
