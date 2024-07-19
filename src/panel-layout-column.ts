import { property, Serializer } from "./jsonobject";
import { Base } from "./base";

export class PanelLayoutColumnModel extends Base {
  @property() width: number;
  @property({
    onSet: (newValue, target, prevVal) => {
      if (newValue !== prevVal) {
        target.width = newValue;
      }
    }
  }) effectiveWidth: number;
  @property() questionTitleWidth: string;

  constructor(width?: number, questionTitleWidth?: string) {
    super();
    this.effectiveWidth = width;
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
    { name: "effectiveWidth:number", isSerializable: false, minValue: 0 },
    { name: "width:number", visible: false },
    "questionTitleWidth",
  ],
  (value: any) => new PanelLayoutColumnModel()
);