<template>
  <fieldset :class="question.cssClasses.root" role="radiogroup">
    <legend v-bind:aria-label="question.locTitle.renderedHtml" v-if="!question.hasTitle"></legend>
    <survey-radiogroup-item
      v-if="!question.hasColumns"
      v-for="(item, index) in question.visibleChoices"
      :key="item.value"
      :class="getItemClass(item)"
      :question="question"
      :item="item"
      :index="index"
    ></survey-radiogroup-item>

    <div
      v-if="question.hasColumns"
      v-for="(column, colIndex) in question.columns"
      :class="question.getColumnClass()"
    >
      <survey-radiogroup-item
        v-for="(item, index) in column"
        :key="item.value"
        :class="getItemClass(item)"
        :question="question"
        :item="item"
        :index="'' + colIndex + index"
      ></survey-radiogroup-item>
    </div>

    <div v-if="question.canShowClearButton">
      <input
        type="button"
        :class="question.cssClasses.clearButton"
        v-on:click="
          () => {
            question.clearValue();
          }
        "
        :value="question.clearButtonCaption"
      />
    </div>
  </fieldset>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionRadiogroupModel } from "survey-core";

@Component
export class Radiogroup extends QuestionVue<QuestionRadiogroupModel> {
  get choicesCount() {
    return this.question.visibleChoices.length - 1;
  }
  getItemClass(item: any) {
    return this.question.getItemClass(item);
  }
}
Vue.component("survey-radiogroup", Radiogroup);
export default Radiogroup;
</script>
