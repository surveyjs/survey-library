<template>
  <fieldset :class="question.cssClasses.root">
    <legend v-bind:aria-label="question.locTitle.renderedHtml"></legend>
    <survey-checkbox-item v-if="!question.hasColumns" v-for="(item, index) in question.visibleChoices"
      :key="item.value" :class="getItemClass(item)"
      :question="question" :item="item" :index="index"></survey-checkbox-item>
    <div v-if="question.hasColumns" v-for="column in question.columns" :class="question.getColumnClass()">
      <survey-checkbox-item v-for="(item, index) in column"
        :key="item.value" :class="getItemClass(item)"
        :question="question" :item="item" :index="index"></survey-checkbox-item>
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
    var itemClass = this.question.cssClasses.item;

    if(!this.question.hasColumns) {
      itemClass +=
      (this.question.colCount === 0
        ? " " + this.question.cssClasses.itemInline
        : " sv-q-col-" + this.question.colCount);
    }

    if (this.question.isItemSelected(item)) {
      itemClass += " checked";
    }
    return itemClass;
  }
}
Vue.component("survey-checkbox", Checkbox);
export default Checkbox;
</script>
