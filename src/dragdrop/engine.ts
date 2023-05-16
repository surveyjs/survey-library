export interface IDragDropEngine {
  dragInit(event: PointerEvent, draggedElement: any, parentElement: any, draggedElementNode: HTMLElement): void;
  dragOver(dropTargetNode: HTMLElement, event: PointerEvent): void;
  drop(): void;
  clear(): void;
  findDropTargetNodeByDragOverNode(dragOverNode: HTMLElement): HTMLElement;
}
