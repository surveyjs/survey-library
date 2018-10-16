import * as React from "react";
import {
  SurveyQuestion,
  ISurveyCreator,
  SurveyElementErrors
} from "./reactquestion";
import { PageModel } from "../page";
import { SurveyModel } from "../survey";
import { QuestionRowModel, PanelModel, PanelModelBase } from "../panel";
import { Question } from "../question";
import { SurveyElementBase } from "./reactquestionelement";

export class SurveyPanelBase extends SurveyElementBase {
  private panelValue: PanelModelBase;
  protected survey: SurveyModel;
  protected creator: ISurveyCreator;
  protected css: any;
  constructor(props: any) {
    super(props);
    this.survey = props.survey;
    this.creator = props.creator;
    this.css = props.css;
  }
  componentWillReceiveProps(nextProps: any) {
    this.survey = nextProps.survey;
    this.creator = nextProps.creator;
    this.css = nextProps.css;
  }
  public get panelBase(): PanelModelBase {
    return this.panelValue;
  }
  public set panelBase(val: PanelModelBase) {
    this.panelValue = val;
    this.makeBaseElementReact(this.panelBase);
  }
  componentDidMount() {
    this.doAfterRender();
  }
  componentWillUnmount() {
    var el: any = this.refs["root"];
    if (!!el) {
      el.removeAttribute("data-rendered");
    }
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    this.doAfterRender();
  }
  private doAfterRender() {
    var el: any = this.refs["root"];
    if (el && this.survey && el.getAttribute("data-rendered") !== "r") {
      el.setAttribute("data-rendered", "r");
      if (this.panelBase.isPanel) {
        this.survey.afterRenderPanel(this.panelBase as PanelModel, el);
      } else {
        this.survey.afterRenderPage(el);
      }
    }
  }
  protected renderRows(): Array<JSX.Element> {
    var rows = [];
    var questionRows = this.panelBase.rows;
    for (var i = 0; i < questionRows.length; i++) {
      rows.push(this.createRow(questionRows[i], i));
    }
    return rows;
  }
  protected createRow(row: QuestionRowModel, index: number): JSX.Element {
    var rowName = "row" + (index + 1);
    return (
      <SurveyRow
        key={rowName}
        row={row}
        survey={this.survey}
        creator={this.creator}
        css={this.css}
      />
    );
  }
}
export class SurveyPage extends SurveyPanelBase {
  constructor(props: any) {
    super(props);
    this.panelBase = props.page;
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.panelBase = nextProps.page;
  }
  public get page(): PageModel {
    return this.panelBase as PageModel;
  }
  render(): JSX.Element {
    if (this.page == null || this.survey == null || this.creator == null)
      return null;
    var title = this.renderTitle();
    var description = this.renderDescription();
    var rows = this.renderRows();
    return (
      <div ref="root" className={this.css.page.root}>
        {title}
        {description}
        {rows}
      </div>
    );
  }
  protected renderTitle(): JSX.Element {
    if (!this.page.title || !this.survey.showPageTitles) return null;
    var text = SurveyElementBase.renderLocString(this.page.locTitle);
    return <h4 className={this.css.pageTitle}>{text}</h4>;
  }
  protected renderDescription(): JSX.Element {
    if (!this.page.description || !this.survey.showPageTitles) return null;
    var text = SurveyElementBase.renderLocString(this.page.locDescription);
    return <div className={this.css.pageDescription}>{text}</div>;
  }
}

export class SurveyPanel extends SurveyPanelBase {
  constructor(props: any) {
    super(props);
    this.panelBase = props.panel;
    this.state = { modelChanged: 0 };
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.panelBase = nextProps.panel;
  }
  public get panel(): PanelModel {
    return this.panelBase as PanelModel;
  }
  componentDidMount() {
    super.componentDidMount();
    let self = this;
    this.panelBase.registerFunctionOnPropertiesValueChanged(
      ["isVisible", "state"],
      function() {
        self.setState({ modelChanged: self.state.modelChanged + 1 });
      },
      "react"
    );
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.panelBase) {
      this.panelBase.unRegisterFunctionOnPropertiesValueChanged(
        ["isVisible", "state"],
        "react"
      );
    }
  }
  render(): JSX.Element {
    if (this.panelBase == null || this.survey == null || this.creator == null)
      return null;
    if (!this.panelBase.isVisible) return null;
    var title = this.renderTitle();
    var description = this.renderDescription();
    var errors = (
      <SurveyElementErrors
        element={this.panelBase}
        cssClasses={this.panelBase.cssClasses}
        creator={this.creator}
      />
    );

    var rows = this.renderRows();
    var style = {
      paddingLeft: this.panel.innerPaddingLeft,
      display: !this.panel.isCollapsed ? "block" : "none"
    };
    var rootStyle: { [index: string]: any } = {};
    if (this.panel.renderWidth) rootStyle["width"] = this.panel.renderWidth;
    return (
      <div ref="root" className={this.css.panel.container} style={rootStyle}>
        {title}
        {description}
        {errors}
        <div style={style}>{rows}</div>
      </div>
    );
  }
  protected renderTitle(): JSX.Element {
    if (!this.panelBase.title) return null;
    var text = SurveyElementBase.renderLocString(this.panelBase.locTitle);
    var expandCollapse = null;
    var titleStyle = this.css.panel.title;
    if (this.panel.isCollapsed || this.panel.isExpanded) {
      titleStyle += " sv_p_title_expandable";
      var iconCss = "sv_panel_icon";
      if (!this.panel.isCollapsed) iconCss += " sv_expanded";
      var changeExpanded = () => {
        if (this.panel.isCollapsed) {
          this.panel.expand();
        } else {
          this.panel.collapse();
        }
        this.setState({ modelChanged: this.state.modelChanged + 1 });
      };
      expandCollapse = <span className={iconCss} />;
    }

    return (
      <h4 className={titleStyle} onClick={changeExpanded}>
        {text}
        {expandCollapse}
      </h4>
    );
  }
  protected renderDescription(): JSX.Element {
    if (!this.panelBase.description) return null;
    var text = SurveyElementBase.renderLocString(this.panelBase.locDescription);
    return <div className={this.css.panel.description}>{text}</div>;
  }
}

export class SurveyRow extends SurveyElementBase {
  private row: QuestionRowModel;
  private survey: SurveyModel;
  private creator: ISurveyCreator;
  protected css: any;
  constructor(props: any) {
    super(props);
    this.setProperties(props);
    this.makeBaseElementReact(this.row);
  }
  componentWillReceiveProps(nextProps: any) {
    this.setProperties(nextProps);
  }
  private setProperties(props: any) {
    this.row = props.row;
    this.survey = props.survey;
    this.creator = props.creator;
    this.css = props.css;
  }
  render(): JSX.Element {
    if (this.row == null || this.survey == null || this.creator == null)
      return null;
    if (this.row.visible) {
      var elements = [];
      for (var i = 0; i < this.row.elements.length; i++) {
        let question = this.row.elements[i] as Question;
        elements.push(this.createQuestion(question));
      }
      return <div className={this.css.row}>{elements}</div>;
    }
    return null;
  }
  protected createQuestion(question: Question): JSX.Element {
    if (question.isPanel) {
      return (
        <SurveyPanel
          key={question.name}
          panel={question}
          creator={this.creator}
          survey={this.survey}
          css={this.css}
        />
      );
    } else {
      return (
        <SurveyQuestion
          key={question.name}
          question={question}
          creator={this.creator}
          css={this.css}
        />
      );
    }
  }
}
