<template>
  <div v-if="question.isVisible" :class="question.getContainerCss()" :id="question.id">
    <survey-errors :element="question" v-if="question.showErrorsAbovePanel" />
    <survey-element-header v-if="question.hasTitle || question.hasDescription" :element="question" :css="css"></survey-element-header>
    <survey-errors :element="question" v-if="!question.showErrorsAbovePanel" />
    <div
      :id="question.contentId"
      :style="{ paddingLeft: question.innerPaddingLeft }"
      v-if="!isCollapsed"
      :class="question.cssClasses.panel.content"
    >
      <template v-for="(row, index) in rows">
        <survey-row
        v-if="row.visible"
        :key="question.id + '_' + index"
        :row="row"
        :survey="survey"
        :css="css"
      >
      </survey-row>
      </template>
      <sv-action-bar :model="question.getFooterToolbar()"></sv-action-bar>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { PanelModel, Base, doKey2ClickUp, ISurvey, QuestionRowModel } from "survey-core";
import { BaseVue } from "./base";

@Component
export class Panel extends BaseVue {
  @Prop() question: PanelModel;
  @Prop() isEditMode: Boolean;
  @Prop() css: any;

  private isCollapsedValue: boolean = false;

  protected getModel(): Base {
    return this.question;
  }
  protected onMounted() {
    if (this.question.survey) {
      this.question.survey.afterRenderPanel(this.question, this.$el as HTMLElement);
    }
    this.isCollapsedValue = this.question.isCollapsed;

    this.question.stateChangedCallback = () => {
      this.isCollapsedValue = this.question.isCollapsed;
    };
  }
  beforeDestroy() {
    this.question.stateChangedCallback = null;
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
    return this.question.isExpanded || this.question.isCollapsed;
  }
  get rows(): QuestionRowModel[] {
    return this.question.rows;
  }
  get survey(): ISurvey {
    return this.question.survey;
  }
  get isCollapsed(): boolean {
    return this.isCollapsedValue;
  }
  cancelPreview() {
    this.question.cancelPreview();
  }
  get requiredTextCss() {
    return (
      this.question.cssClasses.requiredText || this.question.cssClasses.panel.requiredText
    );
  }
}
Vue.component("survey-panel", Panel);
export default Panel;
</script>
