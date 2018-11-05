<template>
    <div v-if="question.isVisible" :class="question.cssClasses.panel.container" :style="rootStyle">
        <h4 v-show="hasTitle" :class="getTitleStyle()" v-on:click="changeExpanded">
          <survey-string :locString="question.locTitle"/>
          <span v-show="showIcon" :class="iconCss"></span>
        </h4>
        <div :class="question.cssClasses.panel.description"><survey-string :locString="question.locDescription"/></div>
        <survey-errors :question="question"/>
        <div :style="{ paddingLeft: question.innerPaddingLeft }" v-show="!isCollapsed">
            <div v-for="(row, index) in rows" :key="question.id + '_' + index" v-if="row.visible" :class="css.row">
                <survey-row :row="row" :survey="survey" :css="css"></survey-row>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { PanelModelBase, PanelModel, QuestionRowModel } from "../panel";
import { ISurvey } from "../base";

@Component
export class Panel extends Vue {
  @Prop question: PanelModel;
  @Prop isEditMode: Boolean;
  @Prop css: any;
  private isCollapsedValue: boolean = false;

  mounted() {
    if (this.question.survey) {
      this.question.survey.afterRenderPanel(this.question, this.$el);
    }
    this.isCollapsed = this.question.isCollapsed;
    var self = this;
    this.question.registerFunctionOnPropertyValueChanged("state", function(
      val: any
    ) {
      self.isCollapsed = self.question.isCollapsed;
    });
  }
  get rootStyle() {
    var result = {};
    if (this.question.renderWidth) {
      (<any>result)["width"] = this.question.renderWidth;
    }
    return result;
  }
  get showIcon() {
    return (
      this.question && (this.question.isExpanded || this.question.isCollapsed)
    );
  }
  get rows() {
    return this.question.rows;
  }
  get hasTitle() {
    return this.question.title.length > 0;
  }
  get survey() {
    return this.question.survey;
  }
  get iconCss() {
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
  getTitleStyle() {
    var result = this.css.panel.title;
    if (this.question.isCollapsed || this.question.isExpanded) {
      result += " sv_p_title_expandable";
    }
    return result;
  }
}
Vue.component("survey-panel", Panel);
export default Panel;
</script>
