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
import { type PropType, ref, defineComponent } from "vue";
import { BaseVue } from "./base";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-panel",
  props: {
    question: { type: Object as PropType<PanelModel>, required: true },
    isEditMode: Boolean,
    css: Object,
  },

  mixins: [BaseVue],
  setup() {
    return {
      isCollapsedValue: ref(false),
    };
  },
  methods: {
    getModel() { 
      return this.question;
    },
    cancelPreview () {
      this.question.cancelPreview();
    }
  },
  computed: {
    rootStyle() {
      var result = {};
      if (this.question.renderWidth) {
        (result as any)["flexBasis"] = this.question.renderWidth;
        (result as any)["flexGrow"] = 1;
        (result as any)["flexShrink"] = 1;
        (result as any)["width"] = this.question.renderWidth;
        (result as any)["minWidth"] = this.question.minWidth;
        (result as any)["maxWidth"] = this.question.maxWidth;
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
    const question = this.question;
    question.stateChangedCallback = () => {
      this.isCollapsedValue = this.question.isCollapsed;
    };
  },
  unmounted() {
    const question = this.question;
    question.stateChangedCallback = null as any;
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>