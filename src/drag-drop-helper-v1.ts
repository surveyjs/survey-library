import { IElement, ISurveyElement } from "./base-interfaces";

export class DragDropInfo {
  constructor(
    public source: IElement,
    public target: IElement,
    public nestedPanelDepth: number = -1
  ) { }
  public destination: ISurveyElement;
  public isBottom: boolean;
  public isEdge: boolean;
}
