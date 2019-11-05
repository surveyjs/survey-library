<template>
  <fieldset :class="question.cssClasses.root">
    <legend v-bind:aria-label="question.locTitle.renderedHtml"></legend>
    <survey-checkbox-item
      v-if="!question.hasColumns"
      v-for="(item, index) in question.visibleChoices"
      :key="item.value"
      :class="getItemClass(item)"
      :question="question"
      :item="item"
      :index="index"
    ></survey-checkbox-item>
    <div
      v-if="question.hasColumns"
      v-for="(column, colIndex) in question.columns"
      :class="question.getColumnClass()"
    >
      <survey-checkbox-item
        v-for="(item, index) in column"
        :key="item.value"
        :class="getItemClass(item)"
        :question="question"
        :item="item"
        :index="'' + colIndex + index"
      ></survey-checkbox-item>
    </div>
  </fieldset>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionCheckboxModel } from "../question_checkbox";

@Component
export class Checkbox extends QuestionVue<QuestionCheckboxModel> {
  getItemClass(item: any) {
    var question = this.question;
    var cssClasses = question.cssClasses;
    var isChecked = question.isItemSelected(item);
    var isDisabled = question.isReadOnly || !item.isEnabled;
    var allowHover = !isChecked && !isDisabled;
    var itemClass = cssClasses.item;
    if (!question.hasColumns) {
      itemClass +=
        question.colCount === 0
          ? " " + cssClasses.itemInline
          : " sv-q-col-" + question.colCount;
    }
    if (isDisabled) itemClass += " " + cssClasses.itemDisabled;
    if (isChecked) itemClass += " " + cssClasses.itemChecked;
    if (allowHover) itemClass += " " + cssClasses.itemHover;
    return itemClass;
  }
}
Vue.component("survey-checkbox", Checkbox);
export default Checkbox;
</script>
