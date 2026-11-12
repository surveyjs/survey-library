import * as React from "react";
import { Base, CalendarItem, CalendarModel, CalendarMonth } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SvgIcon } from "../svg-icon/svg-icon";

interface ICalendarProps {
  model: CalendarModel;
}

export class SurveyCalendar extends SurveyElementBase<ICalendarProps, any> {
  get model(): CalendarModel {
    return this.props.model;
  }
  protected getStateElement(): Base {
    return this.model;
  }
  private renderNavButton(iconName: string, enabled: boolean, action: () => void): React.JSX.Element {
    return (
      <button type="button" className={this.model.cssClasses.navButton} disabled={!enabled} onClick={action}>
        <SvgIcon iconName={iconName} size={"auto"}></SvgIcon>
      </button>
    );
  }
  private renderTitle(): React.JSX.Element {
    const css = this.model.cssClasses;
    if (this.model.showMonthTitles) {
      return (
        <div className={css.monthTitles}>
          {this.model.months.map((month, i) => <div key={i} className={css.monthTitle}>{month.title}</div>)}
        </div>
      );
    }
    return <button type="button" className={css.title} onClick={() => this.model.zoomOut()}>{this.model.title}</button>;
  }
  private renderToolbar(): React.JSX.Element {
    const css = this.model.cssClasses;
    return (
      <div className={css.toolbar}>
        {this.renderNavButton(css.prevIconId, this.model.canPrev, () => this.model.prev())}
        {this.renderTitle()}
        {this.renderNavButton(css.nextIconId, this.model.canNext, () => this.model.next())}
      </div>
    );
  }
  private renderItem(item: CalendarItem, index: number): React.JSX.Element {
    return (
      <div key={index} className={item.css}
        onClick={() => this.model.selectItem(item)}
        onMouseEnter={() => this.model.hoverItem(item)}>
        {item.text}
      </div>
    );
  }
  private renderMonth(month: CalendarMonth, index: number): React.JSX.Element {
    const css = this.model.cssClasses;
    return (
      <div key={index} className={css.monthView}>
        <div className={css.weekDays}>
          {this.model.weekDays.map((name, i) => <div key={i} className={css.weekDay}>{name}</div>)}
        </div>
        <div className={css.days} onMouseLeave={() => this.model.hoverItem(undefined)}>
          {month.days.map((item, i) => this.renderItem(item, i))}
        </div>
      </div>
    );
  }
  protected renderElement(): React.JSX.Element {
    const css = this.model.cssClasses;
    const content = this.model.isDayZoom ?
      <div className={css.months}>{this.model.months.map((month, i) => this.renderMonth(month, i))}</div> :
      <div className={css.grid} onMouseLeave={() => this.model.hoverItem(undefined)}>
        {this.model.items.map((item, i) => this.renderItem(item, i))}
      </div>;
    return (
      <div className={this.model.rootCss}>
        {this.renderToolbar()}
        {content}
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-calendar", (props) => {
  return React.createElement(SurveyCalendar, props);
});
