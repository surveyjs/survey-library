import * as React from "react";
import { Base, CalendarItem, CalendarViewModel } from "survey-core";
import { SurveyElementBase } from "../../reactquestion_element";

interface ICalendarItemProps {
  item: CalendarItem;
  calendar: CalendarViewModel;
}

export class SurveyCalendarItem extends SurveyElementBase<ICalendarItemProps, any> {
  protected getStateElement(): Base {
    return this.props.item;
  }
  protected renderElement(): React.JSX.Element {
    const item = this.props.item;
    const calendar = this.props.calendar;
    return (
      <div className={item.css}
        onClick={() => calendar.selectItem(item)}
        onMouseEnter={() => calendar.hoverItem(item)}>
        {item.text}
      </div>
    );
  }
}
