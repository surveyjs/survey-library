<template>
  <div :class="question.cssClasses.root">
    <label :class="itemClass">
      <input
        type="checkbox"
        :name="question.name"
        :value="question.checkedValue"
        v-model="question.checkedValue"
        :class="question.cssClasses.control"
        :id="question.inputId"
        :indeterminate.prop="question.isIndeterminate"
        :disabled="question.isReadOnly"
        v-bind:aria-required="question.isRequired"
        :aria-label="question.locTitle.renderedHtml"
      />
      <span :class="getLabelClass(false)">{{question.locLabelFalse.renderedHtml}}</span>
      <div :class="question.cssClasses.switch">
        <span :class="question.cssClasses.slider" />
      </div>
      <span :class="getLabelClass(true)">{{question.locLabelTrue.renderedHtml}}</span>
    </label>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionBooleanModel } from "../question_boolean";

@Component
export class Boolean extends QuestionVue<QuestionBooleanModel> {
  get itemClass() {
    var question = this.question;
    var cssClasses = question.cssClasses;
    let isChecked = question.checkedValue;
    let isDisabled = question.isReadOnly;
    let itemClass = cssClasses.item;
    if (isDisabled) itemClass += " " + cssClasses.itemDisabled;
    if (isChecked) itemClass += " " + cssClasses.itemChecked;
    else if (isChecked === null)
      itemClass += " " + cssClasses.itemIndeterminate;
    return itemClass;
  }
  getLabelClass(checked: boolean): string {
    var question = this.question;
    var cssClasses = this.question.cssClasses;
    return (
      cssClasses.label +
      " " +
      (question.checkedValue === !checked || question.isReadOnly
        ? question.cssClasses.disabledLabel
        : "")
    );
  }
}
Vue.component("survey-boolean", Boolean);

export default Boolean;
</script>