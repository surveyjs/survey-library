import { property, Serializer } from "./jsonobject";
import { Base } from "./base";

export class PanelLayoutColumnModel extends Base {
  @property() width: number;
  @property() questionTitleWidth: string;

  constructor(width?: number, questionTitleWidth?: string) {
    super();
    this.width = width;
    this.questionTitleWidth = questionTitleWidth;
  }

  public getType(): string {
    return "panellayoutcolumn";
  }
  public isEmpty(): boolean {
    return !this.width && !this.questionTitleWidth;
  }
}

Serializer.addClass("panellayoutcolumn",
  [
    "width:number",
    "questionTitleWidth",
  ],
  (value: any) => new PanelLayoutColumnModel()
);