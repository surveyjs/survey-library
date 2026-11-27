import { Base } from "../base";
import { property } from "../decorators";

export type CalendarZoom = "day" | "month" | "year";
export type CalendarRangePosition = "start" | "end" | "middle" | "single";

// A cell the renderer subscribes to. Hover and the range preview change the reactive flags
// and css; the date and the fixed flags stay for the life of the cell.
export class CalendarItem extends Base {
  public readonly kind: CalendarZoom;
  public readonly date: Date;
  public readonly text: string;
  public readonly isToday: boolean;
  public readonly isOutside: boolean;
  public readonly isHidden: boolean;
  public readonly isDisabled: boolean;
  @property({ defaultValue: false }) isSelected: boolean;
  // the day is between the range start and end (inclusive), committed or being selected
  @property({ defaultValue: false }) isInRange: boolean;
  @property({ defaultValue: false }) isHovered: boolean;
  @property() rangePosition: CalendarRangePosition;
  @property({ defaultValue: "" }) css: string;

  constructor(kind: CalendarZoom, date: Date, text: string, fixed: { isToday: boolean, isOutside: boolean, isHidden: boolean, isDisabled: boolean }) {
    super();
    this.kind = kind;
    this.date = date;
    this.text = text;
    this.isToday = fixed.isToday;
    this.isOutside = fixed.isOutside;
    this.isHidden = fixed.isHidden;
    this.isDisabled = fixed.isDisabled;
  }
  public getType(): string {
    return "calendaritem";
  }
}
