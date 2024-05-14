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
    <legend class="sv-hidden">{{question.locTitle.renderedHtml}}</legend>
    <component
        v-for="item in question.headItems"
        v-if="question.hasHeadItems"
        :key="item.value"
        :is="question.itemComponent"
        :question="question"
        :item="item"
      ></component>
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
      v-for="item in question.dataChoices"
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
      </fieldset>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionCheckboxModel } from "survey-core";

@Component
export class Checkbox extends QuestionVue<QuestionCheckboxModel> {
}
Vue.component("survey-checkbox", Checkbox);
export default Checkbox;
</script>
