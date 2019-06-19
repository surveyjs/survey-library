<template>
  <fieldset :class="question.cssClasses.root">
    <legend v-bind:aria-label="question.locTitle.renderedHtml"></legend>
    <survey-radiogroup-item v-if="!question.hasColumns" v-for="(item, index) in question.visibleChoices"
      :key="item.value" :class="getItemClass(item)"
      :question="question" :item="item" :index="index"></survey-radiogroup-item>
    <div v-if="question.hasColumns" v-for="column in question.columns" :class="question.getColumnClass()">
      <survey-radiogroup-item v-for="(item, index) in column"
        :key="item.value" :class="getItemClass(item)"
        :question="question" :item="item" :index="index"></survey-radiogroup-item>
    </div>

    <div v-if="question.canShowClearButton">
      <input
        type="button"
        :class="question.cssClasses.clearButton"
        v-on:click="function() { question.clearValue(); }"
        :value="question.clearButtonCaption"
      >
    </div>
  </fieldset>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionRadiogroupModel } from "../question_radiogroup";

@Component
export class Radiogroup extends QuestionVue<QuestionRadiogroupModel> {
  get choicesCount() {
    return this.question.visibleChoices.length - 1;
  }
  getItemClass(item: any) {
    var itemClass = this.question.cssClasses.item

    if(!this.question.hasColumns) {
      itemClass += (this.question.colCount === 0
        ? " sv_q_radiogroup_inline"
        : " sv-q-col-" + this.question.colCount);
    }
    if (item.value === this.question.renderedValue) itemClass += " checked";
    return itemClass;
  }
}
Vue.component("survey-radiogroup", Radiogroup);
export default Radiogroup;
</script>
