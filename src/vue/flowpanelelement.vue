<template>
  <span>
    <component v-if="!question" :is="tagName">
      <survey-flowpanelelement
        v-for="elNode in nodes"
        :key="elNode.elementId"
        :node="elNode"
        :panel="panel"
        css="css"
      />
      {{text}}
    </component>
    <span v-if="!!question">
      <survey-errors v-if="question.errors.length > 0" v:question="question"/>
      <component :is="getWidgetComponentName(question)" :question="question" css="css"/>
    </span>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question } from "../question";
import { FlowPanelModel } from "../flowpanel";

@Component
export class FlowPanelElement extends Vue {
  static idValue: number;
  @Prop node: Node;
  @Prop panel: FlowPanelModel;
  @Prop css: any;
  private elementIdValue: string;
  public question: Question = null;
  public tagName: string = "span";
  public nodes: Array<Node> = [];
  public text: string = "";

  public get elementId(): string {
    if (!this.elementIdValue) {
      if (!FlowPanelElement.idValue) {
        FlowPanelElement.idValue = 0;
      }
      FlowPanelElement.idValue++;
      this.elementIdValue = "fp_el" + FlowPanelElement.idValue;
    }
    return this.elementIdValue;
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
  }
  //duplicated code from element.vue
  getWidgetComponentName(element: Question) {
    if (element.customWidget) {
      return "survey-customwidget";
    }
    return "survey-" + element.getTemplate();
  }
  // duplicated code from reactpages.tsx
  private hasTextChildNodesOnly(node: Node): boolean {
    var nodes = node.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeName.toLowerCase() !== "#text") return false;
    }
    return true;
  }
  private getChildDomNodes(node: Node): Array<Node> {
    var domNodes = [];
    for (var i = 0; i < node.childNodes.length; i++) {
      domNodes.push(node.childNodes[i]);
    }
    return domNodes;
  }
}

Vue.component("survey-flowpanelelement", FlowPanelElement);
export default FlowPanelElement;
</script>