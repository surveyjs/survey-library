<template>
    <div v-if="question.isVisible" :class="css.panel.container" :style="rootStyle">
        <h4 v-show="hasTitle" :class="css.panel.title" v-on:click="changeExpanded">
          <survey-string :locString="question.locTitle"/>
          <span v-show="showIcon" :class="iconCss"></span>
        </h4>
        <div v-show="hasDescription" :class="css.panel.description"><survey-string :locString="question.locDescription"/></div>
        <survey-errors :question="question"/>
        <div :style="{ paddingLeft: getIndentSize(question, question.innerIndent) }" v-show="!question.isCollapsed">
            <div v-for="(row, index) in rows" :key="question.id + '_' + index" v-if="row.visible"   :class="css.row">
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
import { helpers } from "./helpers";

@Component({
  mixins: [helpers]
})
export class Panel extends Vue {
  @Prop question: PanelModel;
  @Prop isEditMode: Boolean;
  @Prop css: any;

  mounted() {
    if (this.question.survey) {
      this.question.survey.afterRenderPanel(this.question, this.$el);
    }
  }
  get rootStyle() {
    var result = {};
    if (this.question.renderWidth) {
      result["width"] = this.question.renderWidth;
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
  get hasDescription() {
    return !!this.question.description;
  }
  get survey() {
    return this.question.survey;
  }
  get iconCss() {
    var result = "sv_panel_icon";
    if (!this.question.isCollapsed) result += " sv_expanded";
    return result;
  }
  changeExpanded() {
    if (this.question.isCollapsed) {
      this.question.expand();
    } else {
      this.question.collapse();
    }
  }
}
Vue.component("survey-panel", Panel);
    export default Panel;
</script>
