import * as React from "react";
import { FlowPanelModel, Question } from "survey-core";
import { ReactElementFactory } from "./element-factory";
import { SurveyPanel } from "./panel";
import { SurveyQuestion } from "./reactquestion";

export class SurveyFlowPanel extends SurveyPanel {
  constructor(props: any) {
    super(props);
  }
  public get flowPanel(): FlowPanelModel {
    return this.panel as FlowPanelModel;
  }
  componentDidMount() {
    super.componentDidMount();
    if (!!this.flowPanel) {
      this.flowPanel.onCustomHtmlProducing = function() {
        return "";
      };
      this.flowPanel.onGetHtmlForQuestion = this.renderQuestion;
    }
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    if (!!this.flowPanel) {
      this.flowPanel.onCustomHtmlProducing = null as any;
      this.flowPanel.onGetHtmlForQuestion = null as any;
    }
  }
  protected getQuestion(name: string): Question {
    return this.flowPanel.getQuestionByName(name);
  }
  protected renderQuestion(question: Question): string {
    return "<question>" + question.name + "</question>";
  }
  protected renderRows(): Array<JSX.Element> {
    const result = this.renderHtml();
    if(!!result) {
      return [result];
    } else {
      return [];
    }
  }
  private renderedIndex: number;
  private getNodeIndex(): number {
    return this.renderedIndex++;
  }
  protected renderHtml(): JSX.Element | null {
    if (!this.flowPanel) return null;
    const html = "<span>" + this.flowPanel.produceHtml() + "</span>";
    if (!DOMParser) {
      const htmlValue = { __html: html };
      return <div dangerouslySetInnerHTML={htmlValue} />;
    }
    const doc = new DOMParser().parseFromString(html, "text/xml");
    this.renderedIndex = 0;
    return this.renderParentNode(doc);
  }
  protected renderNodes(domNodes: Array<Node>): Array<JSX.Element> {
    const nodes: Array<JSX.Element> = [];
    for (let i = 0; i < domNodes.length; i++) {
      const node = this.renderNode(domNodes[i]);
      if(!!node) {
        nodes.push(node);
      }
    }
    return nodes;
  }
  private getStyle(nodeType: string) {
    const style: any = {};
    if (nodeType.toLowerCase() === "b") {
      style.fontWeight = "bold";
    }
    if (nodeType.toLowerCase() === "i") {
      style.fontStyle = "italic";
    }
    if (nodeType.toLowerCase() === "u") {
      style.textDecoration = "underline";
    }
    return style;
  }
  protected renderParentNode(node: Node): JSX.Element {
    const nodeType = node.nodeName.toLowerCase();
    const children = this.renderNodes(this.getChildDomNodes(node));
    if (nodeType === "div")
      return <div key={this.getNodeIndex()}>{children}</div>;
    return (
      <span key={this.getNodeIndex()} style={this.getStyle(nodeType)}>
        {children}
      </span>
    );
  }
  protected renderNode(node: Node): JSX.Element | null {
    if (!this.hasTextChildNodesOnly(node)) {
      return this.renderParentNode(node);
    }
    const nodeType = node.nodeName.toLowerCase();
    if (nodeType === "question") {
      const question = this.flowPanel.getQuestionByName(node.textContent as any);
      if (!question) return null;
      const questionBody = (
        <SurveyQuestion
          key={question.name}
          element={question}
          creator={this.creator}
          css={this.css}
        />
      );
      return <span key={this.getNodeIndex()}>{questionBody}</span>;
    }
    if (nodeType === "div") {
      return <div key={this.getNodeIndex()}>{node.textContent}</div>;
    }
    return (
      <span key={this.getNodeIndex()} style={this.getStyle(nodeType)}>
        {node.textContent}
      </span>
    );
  }
  private getChildDomNodes(node: Node): Array<Node> {
    const domNodes: Array<Node> = [];
    for (let i = 0; i < node.childNodes.length; i++) {
      domNodes.push(node.childNodes[i]);
    }
    return domNodes;
  }
  private hasTextChildNodesOnly(node: Node): boolean {
    const nodes = node.childNodes;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeName.toLowerCase() !== "#text") return false;
    }
    return true;
  }
  protected renderContent(style: any, rows: JSX.Element[]): JSX.Element {
    return React.createElement("f-panel", { style: style }, rows);
  }
}

ReactElementFactory.Instance.registerElement("flowpanel", props => {
  return React.createElement(SurveyFlowPanel, props);
});
