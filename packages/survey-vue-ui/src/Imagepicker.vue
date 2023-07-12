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
import { QuestionVue } from "./base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-imagepicker",
  mixins: [QuestionVue],
  props: {
    question: { type: Object as PropType<QuestionImagePickerModel>, required: true },
    css: Object,
  },
  methods: {
    getItemClass(item: any) {
      return this.question.getItemClass(item);
    },
  },
});
</script>
