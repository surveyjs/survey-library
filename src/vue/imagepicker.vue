<template>
  <fieldset :class="question.getSelectBaseRootCss()">
    <legend class="sv-hidden">{{question.locTitle.renderedHtml}}</legend>
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
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionImagePickerModel } from "survey-core";

@Component
export class ImagePicker extends QuestionVue<QuestionImagePickerModel> {
  getItemClass(item: any) {
    return this.question.getItemClass(item);
  }
}
Vue.component("survey-imagepicker", ImagePicker);
export default ImagePicker;
</script>

