<template>
  <fieldset :class="question.getSelectBaseRootCss()">
    <legend
      role="radio"
      v-bind:aria-label="question.locTitle.renderedHtml"
    >
    </legend>
    <survey-imagepicker-item v-if="!question.hasColumns" v-for="(item) in question.visibleChoices" :key="item.value" :question="question" :item="item"></survey-imagepicker-item>  
    <div
      v-if="question.hasColumns"
      v-for="(column, colIndex) in question.columns"
      :class="question.getColumnClass()"
      :key="colIndex"
      role="presentation"
    >
      <survey-imagepicker-item
        v-for="(item) in column"
        :key="item.value"
        :question="question"
        :item="item"
      ></survey-imagepicker-item>
    </div>
  </fieldset>
</template>

<script lang="ts">
import { QuestionImagePickerModel } from "survey-core";
import { defineSurveyComponent } from "./base";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "survey-imagepicker",
  props: {
    question: QuestionImagePickerModel,
    css: Object,
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.question; },
      getItemClass(item: any) {
        return vm.question.getItemClass(item);
      }
    }
  },
  mounted() {
    if (this.question) {
      this.question.afterRenderQuestionElement(this.$el as HTMLElement);
    }
  },
  unmounted() {
    if (this.question) {
      this.question.beforeDestroyQuestionElement(this.$el as HTMLElement);
    }
  }
});

</script>

