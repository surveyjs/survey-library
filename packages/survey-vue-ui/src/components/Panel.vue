<template>
  <div v-if="question.isVisible" :class="question.getContainerCss()" :id="question.id">
    <survey-element-header v-if="question.hasTitle || question.hasDescription" :element="question" :css="css"></survey-element-header>
    <survey-errors :element="question" />
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
import { PanelModel, Base, doKey2ClickUp, ISurvey, QuestionRowModel } from "survey-core";
import { defineSurveyComponent } from "../base";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "survey-panel",
  props: {
    question: PanelModel,
    isEditMode: Boolean,
    css: Object,
  },
  data: (vm: any) => {
    return {
      isCollapsedValue: false,
      getModel: () => { return vm.question; },
      cancelPreview: () => {
        this.question.cancelPreview();
      }
    }
  },
  computed: {
    rootStyle() {
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
    },
    showIcon() {
      return this.question.isExpanded || this.question.isCollapsed;
    },
    rows(): QuestionRowModel[] {
      return this.question.rows;
    },
    survey(): ISurvey {
      return this.question.survey;
    },
    isCollapsed(): boolean {
      return this.isCollapsedValue;
    },
    requiredTextCss() {
      return (
        this.question.cssClasses.requiredText || this.question.cssClasses.panel.requiredText
      );
    }
  },
  mounted() {
    if (this.question.survey) {
      this.question.survey.afterRenderPanel(this.question, this.$el as HTMLElement);
    }
    this.isCollapsedValue = this.question.isCollapsed;

    this.question.stateChangedCallback = () => {
      this.isCollapsedValue = this.question.isCollapsed;
    };
  },
  unmounted() {
    this.question.stateChangedCallback = null;
  }
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>