<template>
  <div
    v-if="question.isVisible"
    :class="question.cssClasses.panel.container"
    :style="rootStyle"
  >
    <survey-element-title :element="question" :css="css"/>
    <div :class="question.cssClasses.panel.description">
      <survey-string :locString="question.locDescription" />
    </div>
    <survey-errors :element="question" />
    <div
      :id="question.contentId"
      :style="{ paddingLeft: question.innerPaddingLeft }"
      v-if="!isCollapsed"
      :class="question.cssClasses.panel.content"
    >
      <div
        v-for="(row, index) in rows"
        :key="question.id + '_' + index"
        v-if="row.visible"
        :class="css.row"
      >
        <survey-row :row="row" :survey="survey" :css="css"></survey-row>
      </div>
    <sv-action-bar
      :model="question.getFooterToolbar()"
    ></sv-action-bar>
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

  private isCollapsed: boolean = false;

  protected getModel(): Base {
    return this.question;
  }
  protected onMounted() {
    if (this.question.survey) {
      this.question.survey.afterRenderPanel(this.question, this.$el as HTMLElement);
    }
    this.isCollapsed = this.question.isCollapsed;

    this.question.stateChangedCallback = () => {
      this.isCollapsed = this.question.isCollapsed;
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
  keyup(evt: any) {
    doKey2ClickUp(evt);
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
