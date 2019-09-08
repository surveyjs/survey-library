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
      <span :class="question.cssClasses.materialDecorator">
        <svg viewBox="0 0 24 24" :class="question.cssClasses.itemDecorator">
          <rect :class="question.cssClasses.uncheckedMark" x="5" y="10" width="14" height="4" />
          <polygon
            :class="question.cssClasses.checkedMark"
            points="19,10 14,10 14,5 10,5 10,10 5,10 5,14 10,14 10,19 14,19 14,14 19,14 "
          />
          <path
            :class="question.cssClasses.undefinedMark"
            d="M22,0H2C0.9,0,0,0.9,0,2v20c0,1.1,0.9,2,2,2h20c1.1,0,2-0.9,2-2V2C24,0.9,23.1,0,22,0z M21,18L6,3h15V18z M3,6l15,15H3V6z"
          />
        </svg>
        <span class="check"></span>
      </span>
      <span :class="question.cssClasses.label">
        <survey-string :locString="question.locDisplayLabel" />
      </span>
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
    let isChecked = this.question.checkedValue;
    let itemClass =
      this.question.cssClasses.item + (isChecked ? " checked" : "");
    return itemClass;
  }
}
Vue.component("survey-boolean", Boolean);

export default Boolean;
</script>