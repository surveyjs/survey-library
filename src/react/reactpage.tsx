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
import { FlowPanelModel } from "../flowpanel";
import { IElement } from "../base";

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
  }
  componentWillMount() {
    this.makeBaseElementReact(this.panelBase);
  }
  componentDidMount() {
    this.doAfterRender();
  }
  componentWillUnmount() {
    this.unMakeBaseElementReact(this.panelBase);
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
    this.unMakeBaseElementReact(this.panelBase);
    super.componentWillReceiveProps(nextProps);
    this.panelBase = nextProps.page;
    this.makeBaseElementReact(this.panelBase);
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
  }
  componentWillReceiveProps(nextProps: any) {
    this.unMakeBaseElementReact(this.panelBase);
    super.componentWillReceiveProps(nextProps);
    this.panelBase = nextProps.panel;
    this.makeBaseElementReact(this.panelBase);
  }
  public get panel(): PanelModel {
    return this.panelBase as PanelModel;
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
    var bottom = this.renderBottom();
    return (
      <div ref="root" className={this.css.panel.container} style={rootStyle}>
        {title}
        {description}
        {errors}
        <div style={style}>{rows}</div>
        {bottom}
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
  protected renderBottom(): JSX.Element {
    return null;
  }
}

export class SurveyFlowPanel extends SurveyPanel {
  constructor(props: any) {
    super(props);
  }
  public get flowPanel(): FlowPanelModel {
    return this.panel as FlowPanelModel;
  }
  componentWillMount() {
    super.componentWillMount();
    if (!!this.flowPanel) {
      var self = this;
      this.flowPanel.onCustomHtmlProducing = function() {
        return "";
      };
      this.flowPanel.onGetHtmlForQuestion = self.renderQuestion;
    }
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    if (!!this.flowPanel) {
      this.flowPanel.onCustomHtmlProducing = null;
      this.flowPanel.onGetHtmlForQuestion = null;
    }
  }
  protected getQuestion(name: string): Question {
    return this.flowPanel.getQuestionByName(name);
  }
  protected renderQuestion(question: Question): string {
    return "<question>" + question.name + "</question>";
  }
  protected renderRows(): Array<JSX.Element> {
    return [this.renderHtml()];
  }
  private renderedIndex: number;
  private getNodeIndex(): number {
    return this.renderedIndex++;
  }
  protected renderHtml(): JSX.Element {
    if (!this.flowPanel) return null;
    let html = "<span>" + this.flowPanel.produceHtml() + "</span>";
    if (!DOMParser) {
      var htmlValue = { __html: html };
      return <div dangerouslySetInnerHTML={htmlValue} />;
    }
    let doc = new DOMParser().parseFromString(html, "text/xml");
    this.renderedIndex = 0;
    return this.renderParentNode(doc);
  }
  protected renderNodes(domNodes: Array<Node>): Array<JSX.Element> {
    var nodes = [];
    for (var i = 0; i < domNodes.length; i++) {
      nodes.push(this.renderNode(domNodes[i]));
    }
    return nodes;
  }
  protected renderParentNode(node: Node): JSX.Element {
    var nodeType = node.nodeName.toLowerCase();
    var children = this.renderNodes(this.getChildDomNodes(node));
    if (nodeType == "div")
      return <div key={this.getNodeIndex()}>{children}</div>;
    return <span key={this.getNodeIndex()}>{children}</span>;
  }
  protected renderNode(node: Node): JSX.Element {
    if (!this.hasTextChildNodesOnly(node)) {
      return this.renderParentNode(node);
    }
    var nodeType = node.nodeName.toLowerCase();
    if (nodeType == "question") {
      var question = this.flowPanel.getQuestionByName(node.textContent);
      if (!question) return null;
      var questionBody = SurveyQuestion.renderQuestionBody(
        this.creator,
        question
      );
      return <span key={this.getNodeIndex()}>{questionBody}</span>;
    }
    if (nodeType == "div") {
      return <div key={this.getNodeIndex()}>{node.textContent}</div>;
    }
    return <span key={this.getNodeIndex()}>{node.textContent}</span>;
  }
  private getChildDomNodes(node: Node): Array<Node> {
    var domNodes = [];
    for (var i = 0; i < node.childNodes.length; i++) {
      domNodes.push(node.childNodes[i]);
    }
    return domNodes;
  }
  private hasTextChildNodesOnly(node: Node): boolean {
    var nodes = node.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeName.toLowerCase() !== "#text") return false;
    }
    return true;
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
  }
  componentWillMount() {
    this.makeBaseElementReact(this.row);
  }
  componentWillUnmount() {
    this.unMakeBaseElementReact(this.row);
  }
  componentWillReceiveProps(nextProps: any) {
    this.unMakeBaseElementReact(this.row);
    this.setProperties(nextProps);
    this.makeBaseElementReact(this.row);
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
  protected createQuestion(question: IElement): JSX.Element {
    if (question.isPanel) {
      var pnl = question as PanelModel;
      if (pnl.getChildrenLayoutType() == "flow")
        return (
          <SurveyFlowPanel
            key={question.name}
            panel={question}
            creator={this.creator}
            survey={this.survey}
            css={this.css}
          />
        );
      return (
        <SurveyPanel
          key={question.name}
          panel={question}
          creator={this.creator}
          survey={this.survey}
          css={this.css}
        />
      );
    }
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
