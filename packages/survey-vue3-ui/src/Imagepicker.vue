<template>
  <fieldset :class="question.getSelectBaseRootCss()" ref="root">
    <legend
      role="radio"
      v-bind:aria-label="question.locTitle.renderedHtml"
    ></legend>
    <template v-if="!question.hasColumns">
      <survey-imagepicker-item
        v-for="item in question.visibleChoices"
        :key="item.value"
        :question="question"
        :item="item"
      ></survey-imagepicker-item>
    </template>
    <template v-if="question.hasColumns">
      <div
        v-for="(column, colIndex) in question.columns"
        :class="question.getColumnClass()"
        :key="colIndex"
        role="presentation"
      >
        <survey-imagepicker-item
          v-for="item in column"
          :key="item.value"
          :question="question"
          :item="item"
        ></survey-imagepicker-item>
      </div>
    </template>
  </fieldset>
</template>

<script lang="ts" setup>
import type { QuestionImagePickerModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
const props = defineProps<{ question: QuestionImagePickerModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
