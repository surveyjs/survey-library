import * as React from "react";
import { Base, CalendarItem, CalendarMonth, CalendarViewModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SurveyActionBar } from "../action-bar/action-bar";
import { SurveyCalendarItem } from "./calendar-item";

interface ICalendarProps {
  model: CalendarViewModel;
}

export class SurveyCalendar extends SurveyElementBase<ICalendarProps, any> {
  private rootRef: React.RefObject<HTMLDivElement>;
  constructor(props: ICalendarProps) {
    super(props);
    this.rootRef = React.createRef();
  }
  get model(): CalendarViewModel {
    return this.props.model;
  }
  protected getStateElement(): Base {
    return this.model;
  }
  componentDidMount(): void {
    super.componentDidMount();
    this.model.attachMonthList(this.rootRef.current);
  }
  componentDidUpdate(prevProps: ICalendarProps, prevState: any): void {
    super.componentDidUpdate(prevProps, prevState);
    this.model.attachMonthList(this.rootRef.current);
  }
  componentWillUnmount(): void {
    this.model.detachMonthList();
    super.componentWillUnmount();
  }
  private renderWeekDays(): React.JSX.Element {
    const css = this.model.cssClasses;
    return (
      <div className={css.weekDays}>
        {this.model.weekDays.map((name, i) => <div key={i} className={css.weekDay}>{name}</div>)}
      </div>
    );
  }
  private renderFooter(): React.JSX.Element {
    if (!this.model.footerVisible) return null;
    return (
      <div className={this.model.cssClasses.footer}>
        <SurveyActionBar model={this.model.footerToolbar}></SurveyActionBar>
      </div>
    );
  }
  private renderListHeader(): React.JSX.Element {
    if (!this.model.isMonthList) return null;
    return (
      <div className={this.model.cssClasses.listHeader}>
        {this.renderWeekDays()}
      </div>
    );
  }
  private renderToolbar(): React.JSX.Element {
    if (!this.model.showTopToolbar) return null;
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
  private renderDay(item: CalendarItem, index: number): React.JSX.Element {
    return <div key={index} className={this.model.cssClasses.dayCell}><SurveyCalendarItem item={item} calendar={this.model} /></div>;
  }
  private renderItem(item: CalendarItem, index: number): React.JSX.Element {
    return <SurveyCalendarItem key={index} item={item} calendar={this.model} />;
  }
  private renderMonth(month: CalendarMonth): React.JSX.Element {
    const css = this.model.cssClasses;
    const key = this.model.getMonthKey(month);
    const title = this.model.isMonthList ? <div className={css.monthTitle}>{month.title}</div> : null;
    const weekDays = this.model.showMonthWeekDays ? this.renderWeekDays() : null;
    return (
      <div key={key} className={css.monthView} data-month={key}>
        {title}
        {weekDays}
        <div className={css.table} onMouseLeave={() => this.model.hoverItem(undefined)}>
          {month.days.map((item, i) => this.renderDay(item, i))}
        </div>
      </div>
    );
  }
  protected renderElement(): React.JSX.Element {
    const css = this.model.cssClasses;
    const content = this.model.isDayZoom ?
      <div className={css.months}>{this.model.months.map(month => this.renderMonth(month))}</div> :
      <div className={css.table} onMouseLeave={() => this.model.hoverItem(undefined)}>
        {this.model.items.map((item, i) => this.renderItem(item, i))}
      </div>;
    return (
      <div className={this.model.rootCss} ref={this.rootRef}>
        {this.renderListHeader()}
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
