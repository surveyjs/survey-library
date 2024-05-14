<template>
  <span :style="style">
    <component v-if="!question" :is="tagName">
      <survey-flowpanelelement
        v-for="elNode in nodes"
        :key="elNode.id"
        :node="elNode.node"
        :panel="panel"
        css="css"
      />
      {{ text }}
    </component>
    <span v-if="!!question">
      <survey-element
        :key="question.idValue"
        :id="question.id"
        :style="{
          flexBasis: question.renderWidth,
          flexGrow: 1,
          flexShrink: 1,
          width: question.renderWidth,
          minWidth: question.minWidth,
          maxWidth: question.maxWidth,
        }"
        :element="question"
        :survey="survey"
        :css="css"
      />
    </span>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question, SurveyModel, FlowPanelModel } from "survey-core";
import { getComponentName } from "./question";

@Component
export class FlowPanelElement extends Vue {
  static idValue: number;
  @Prop() node: Node;
  @Prop() panel: FlowPanelModel;
  @Prop() css: any;
  private elementIdValue: string;
  public question: Question = null;
  public tagName: string = "span";
  public nodes: Array<{ node: Node, id: string }> = [];
  public text: string = "";
  public style: any = {};

  private getStyle(nodeType: string) {
    var style: any = {};
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
  public getElementId(): string {
    if (!this.elementIdValue) {
      if (!FlowPanelElement.idValue) {
        FlowPanelElement.idValue = 0;
      }
      FlowPanelElement.idValue++;
      this.elementIdValue = "fp_el" + FlowPanelElement.idValue;
    }
    return this.elementIdValue;
  }
  public get survey(): SurveyModel {
    return <SurveyModel>this.panel.survey;
  }
  beforeMount() {
    if (!this.panel || !this.node) return;
    var nodeType = this.node.nodeName.toLowerCase();
    if (!this.hasTextChildNodesOnly(this.node)) {
      this.nodes = this.getChildDomNodes(this.node);
    } else {
      if (nodeType == "question") {
        this.question = this.panel.getQuestionByName(this.node.textContent);
      } else {
        this.text = this.node.textContent;
      }
    }
    if (nodeType == "div" && !this.question) {
      this.tagName = "div";
    }
    this.style = this.getStyle(nodeType);
  }
  //duplicated code from element.vue
  getComponentName(element: Question) {
    return getComponentName(element);
  }
  // duplicated code from reactpages.tsx
  private hasTextChildNodesOnly(node: Node): boolean {
    var nodes = node.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeName.toLowerCase() !== "#text") return false;
    }
    return true;
  }
  private getChildDomNodes(node: Node): Array<{ node: Node, id: string }> {
    var domNodes: Array<{ node: Node, id: string }> = [];
    for (var i = 0; i < node.childNodes.length; i++) {
      domNodes.push({ node: node.childNodes[i], id: this.getElementId() });
    }
    return domNodes;
  }
}

Vue.component("survey-flowpanelelement", FlowPanelElement);
export default FlowPanelElement;
</script>
