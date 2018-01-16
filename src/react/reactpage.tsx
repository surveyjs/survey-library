import * as React from "react";
import {
  SurveyQuestion,
  ISurveyCreator,
  SurveyElementErrors
} from "./reactquestion";
import { PageModel } from "../page";
import { SurveyModel } from "../survey";
import { QuestionRowModel, PanelModel } from "../panel";
import { QuestionBase } from "../questionbase";
import { SurveyElementBase } from "./reactquestionelement";

export class SurveyPage extends React.Component<any, any> {
  private page: PageModel;
  private survey: SurveyModel;
  private creator: ISurveyCreator;
  protected css: any;
  constructor(props: any) {
    super(props);
    this.page = props.page;
    this.survey = props.survey;
    this.creator = props.creator;
    this.css = props.css;
  }
  componentWillReceiveProps(nextProps: any) {
    this.page = nextProps.page;
    this.survey = nextProps.survey;
    this.creator = nextProps.creator;
    this.css = nextProps.css;
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
  componentDidUpdate(prevProps, prevState) {
    this.doAfterRender();
  }
  private doAfterRender() {
    var el: any = this.refs["root"];
    if (el && this.survey && el.getAttribute("data-rendered") !== "r") {
      el.setAttribute("data-rendered", "r");
      this.survey.afterRenderPage(el);
    }
  }
  render(): JSX.Element {
    if (this.page == null || this.survey == null || this.creator == null)
      return null;
    var title = this.renderTitle();
    var description = this.renderDescription();
    var rows = [];
    var questionRows = this.page.rows;
    var self = this;
    for (var i = 0; i < questionRows.length; i++) {
      var row = questionRows[i];
      row.visibilityChangedCallback = function() {
        self.forceUpdate();
      };

      rows.push(this.createRow(questionRows[i], i));
    }
    return (
      <div ref="root" className={this.css.page.root}>
        {title}
        {description}
        {rows}
      </div>
    );
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

export class SurveyPanel extends React.Component<any, any> {
  private panel: PanelModel;
  private survey: SurveyModel;
  private creator: ISurveyCreator;
  protected css: any;
  constructor(props: any) {
    super(props);
    this.panel = props.panel;
    this.survey = props.survey;
    this.creator = props.creator;
    this.css = props.css;
    this.state = { modelChanged: 0 };
  }
  componentWillReceiveProps(nextProps: any) {
    this.panel = nextProps.panel;
    this.survey = nextProps.survey;
    this.creator = nextProps.creator;
    this.css = nextProps.css;
  }
  componentDidMount() {
    let self = this;
    this.doAfterRender();
    this.panel.registerFunctionOnPropertiesValueChanged(
      ["isVisible", "renderWidth", "innerIndent", "rightIndent", "state"],
      function() {
        self.setState({ modelChanged: self.state.modelChanged + 1 });
      },
      "react"
    );
  }
  componentDidUpdate(prevProps, prevState) {
    this.doAfterRender();
  }
  private doAfterRender() {
    let el: any = this.refs["root"];
    if (el && this.survey && el.getAttribute("data-rendered") !== "r") {
      el.setAttribute("data-rendered", "r");
      this.survey.afterRenderPanel(this.panel, el);
    }
  }
  componentWillUnmount() {
    if (this.panel) {
      this.panel.unRegisterFunctionOnPropertiesValueChanged(
        ["isVisible", "renderWidth", "innerIndent", "rightIndent", "state"],
        "react"
      );
      var el: any = this.refs["root"];
      if (!!el) {
        el.removeAttribute("data-rendered");
      }
    }
  }
  render(): JSX.Element {
    if (this.panel == null || this.survey == null || this.creator == null)
      return null;
    if (!this.panel.isVisible) return null;
    var title = this.renderTitle();
    var description = this.renderDescription();
    var errors = (
      <SurveyElementErrors
        element={this.panel}
        cssClasses={this.panel.cssClasses}
        creator={this.creator}
      />
    );

    var rows = [];
    var questionRows = this.panel.rows;
    var self = this;
    for (var i = 0; i < questionRows.length; i++) {
      var row = questionRows[i];
      row.visibilityChangedCallback = function() {
        self.forceUpdate();
      };

      rows.push(this.createRow(questionRows[i], i));
    }
    var style = {
      paddingLeft: this.panel.innerIndent * this.css.question.indent + "px",
      display: !this.panel.isCollapsed ? "block" : "none"
    };
    var rootStyle = {};
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
  protected renderTitle(): JSX.Element {
    if (!this.panel.title) return null;
    var text = SurveyElementBase.renderLocString(this.panel.locTitle);
    var expandCollapse = null;
    if (this.panel.isCollapsed || this.panel.isExpanded) {
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
      <h4 className={this.css.panel.title} onClick={changeExpanded}>
        {text}
        {expandCollapse}
      </h4>
    );
  }
  protected renderDescription(): JSX.Element {
    if (!this.panel.description) return null;
    var text = SurveyElementBase.renderLocString(this.panel.locDescription);
    return <div className={this.css.panel.description}>{text}</div>;
  }
}

export class SurveyRow extends React.Component<any, any> {
  private row: QuestionRowModel;
  private survey: SurveyModel;
  private creator: ISurveyCreator;
  protected css: any;
  constructor(props: any) {
    super(props);
    this.setProperties(props);
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
      var questions = [];
      for (var i = 0; i < this.row.elements.length; i++) {
        let question = this.row.elements[i] as QuestionBase;
        questions.push(this.createQuestion(question));
      }
      return <div className={this.css.row}>{questions}</div>;
    }
    return null;
  }
  protected createQuestion(question: QuestionBase): JSX.Element {
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
