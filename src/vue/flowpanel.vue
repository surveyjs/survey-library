<template>
  <div
    v-if="question.isVisible"
    :class="question.cssClasses.panel.container"
    :style="rootStyle"
  >
    <h4
      v-show="hasTitle"
      :class="question.cssTitle"
      v-on:click="changeExpanded"
    >
      <survey-string :locString="question.locTitle" />
      <span v-show="showIcon" :class="iconCss"></span>
    </h4>
    <div :class="question.cssClasses.panel.description">
      <survey-string :locString="question.locDescription" />
    </div>
    <survey-errors :element="question" />
    <f-panel
      :style="{ paddingLeft: question.innerPaddingLeft }"
      v-show="!isCollapsed"
    >
      <survey-flowpanelelement :node="rootNode" :panel="question" css="css" />
    </f-panel>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import {
  FlowPanelModel,
  Question,
  CssClassBuilder,
  QuestionRowModel,
  ISurvey,
} from "survey-core";

@Component
export class FlowPanel extends Vue {
  @Prop() question: FlowPanelModel;
  @Prop() isEditMode: Boolean;
  @Prop() css: any;
  private isCollapsedValue: boolean = false;
  private rootNodeValue: Node;

  get rootNode(): Node {
    return this.rootNodeValue;
  }
  beforeMount() {
    if (!this.question) return;
    var self = this;
    this.question.onCustomHtmlProducing = function () {
      return "";
    };
    this.question.onGetHtmlForQuestion = self.renderQuestion;
    this.setRootNode();
  }
  protected setRootNode() {
    let html = "<span>" + this.question.produceHtml() + "</span>";
    let doc = new DOMParser().parseFromString(html, "text/xml");
    this.rootNodeValue =
      !!doc && doc.childNodes.length > 0 ? doc.childNodes[0] : null;
  }
  protected renderQuestion(question: Question): string {
    return "<question>" + question.name + "</question>";
  }
  mounted() {
    if (this.question.survey) {
      this.question.survey.afterRenderPanel(
        this.question,
        this.$el as HTMLElement
      );
    }
    this.isCollapsed = this.question.isCollapsed;
    this.question.registerPropertyChangedHandlers(["state"], (val: any) => { this.isCollapsed = this.question.isCollapsed; });
  }
  get rootStyle() {
    var result = {};
    if (this.question.renderWidth) {
      (<any>result)["flexBasis"] = this.question.renderWidth;
      (<any>result)["flexGrow"] = 1;
      (<any>result)["flexShrink"] = 1;
      (<any>result)["width"] = this.question.renderWidth;
      (<any>result)["minWidth"] = this.question.minWidth;
      (<any>result)["maxWidth"] = this.question.maxWidth;
    }
    return result;
  }
  get showIcon() {
    return (
      this.question && (this.question.isExpanded || this.question.isCollapsed)
    );
  }
  get rows(): QuestionRowModel[] {
    return this.question.rows;
  }
  get hasTitle() {
    return this.question.title.length > 0;
  }
  get survey(): ISurvey {
    return this.question.survey;
  }
  get iconCss() {
    //refactor
    var result = "sv_panel_icon";
    if (!this.isCollapsed) result += " sv_expanded";
    return result;
  }
  get isCollapsed() {
    return this.isCollapsedValue;
  }
  set isCollapsed(val: boolean) {
    this.isCollapsedValue = val;
  }
  changeExpanded() {
    if (this.question.isCollapsed || this.question.isExpanded) {
      if (this.question.isCollapsed) {
        this.question.expand();
      } else {
        this.question.collapse();
      }
    }
  }
}

Vue.component("survey-flowpanel", FlowPanel);
export default FlowPanel;
</script>
