<template>
  <fieldset :class="question.getSelectBaseRootCss()"
    :role="question.a11y_input_ariaRole"
    :aria-required="question.a11y_input_ariaRequired"
    :aria-label="question.a11y_input_ariaLabel"
    :aria-labelledby="question.a11y_input_ariaLabelledBy"
    :aria-describedby="question.a11y_input_ariaDescribedBy"
    :aria-invalid="question.a11y_input_ariaInvalid"
    :aria-errormessage="question.a11y_input_ariaErrormessage"
  >
    <component
      v-if="!question.hasColumns && !question.blockedRow"
      v-for="(item) in question.bodyItems"
      :key="item.value"
      :is="question.itemComponent"
      :question="question"
      :item="item"
    ></component>
    <div :class="question.cssClasses.rootRow" v-if="question.blockedRow">
    <component
      v-if="!question.hasColumns && question.blockedRow"
      v-for="(item) in question.dataChoices"
      :key="item.value"
      :is="question.itemComponent"
      :question="question"
      :item="item"
    ></component>
    </div>
    <div
      v-if="question.hasColumns"
      :class="question.cssClasses.rootMultiColumn">
    <div
      v-if="question.hasColumns"
      v-for="(column, colIndex) in question.columns"
      v-bind:key="colIndex"
      :class="question.getColumnClass()"
      role="presentation"
    >
      <component
        v-for="item in column"
        :key="item.value"
        :is="question.itemComponent"
        :question="question"
        :item="item"
      ></component>
    </div>
    </div>
        <component
        v-for="item in question.footItems"
        v-if="question.hasFootItems"
        :key="item.value"
        :is="question.itemComponent"
        :question="question"
        :item="item"
      ></component>
      <survey-other-choice
        v-if="
          question.renderedValue && question.isOtherSelected
        "
        :question="question"
      />
    <div v-if="question.showClearButtonInContent">
      <input
        type="button"
        :class="question.cssClasses.clearButton"
        v-on:click="
          () => {
            question.clearValue();
          }
        "
        :value="question.clearButtonCaption"
      /></div></fieldset>
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
}
Vue.component("survey-radiogroup", Radiogroup);
export default Radiogroup;
</script>
