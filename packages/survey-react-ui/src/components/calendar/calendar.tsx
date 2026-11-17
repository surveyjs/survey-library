import * as React from "react";
import { Base, CalendarItem, CalendarModel, CalendarMonth } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SurveyActionBar } from "../action-bar/action-bar";

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
  private renderFooter(): React.JSX.Element {
    if (!this.model.footerVisible) return null;
    return (
      <div className={this.model.cssClasses.footer}>
        <SurveyActionBar model={this.model.footerToolbar}></SurveyActionBar>
      </div>
    );
  }
  private renderToolbar(): React.JSX.Element {
    const css = this.model.cssClasses;
    const monthTitles = this.model.showMonthTitles ?
      <div className={css.monthTitles}>
        {this.model.months.map((month, i) => <div key={i} className={css.monthTitle}>{month.title}</div>)}
      </div> : null;
    return (
      <div className={css.toolbar}>
        {monthTitles}
        <SurveyActionBar model={this.model.topToolbar}></SurveyActionBar>
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
        {this.renderFooter()}
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-calendar", (props) => {
  return React.createElement(SurveyCalendar, props);
});
