<template>
  <div :class="question.cssClasses.root">
    <div v-if="!question.isReadOnly" :class="question.cssClasses.selectWrapper">
      <select
        :id="question.inputId"
        v-model="question.renderedValue"
        :class="question.cssClasses.control"
        v-bind:aria-label="question.locTitle.renderedHtml"
        :aria-invalid="question.errors.length > 0"
        :aria-describedby="question.errors.length > 0 ? question.id + '_errors' : null"  
      >
        <option v-if="question.showOptionsCaption" :value="undefined">{{question.optionsCaption}}</option>
        <option
          v-for="item in question.visibleChoices"
          :value="item.value"
          :disabled="!item.isEnabled"
        >{{item.text}}</option>
      </select>
    </div>
    <div
      disabled
      v-else
      :id="question.inputId"
      :class="question.cssClasses.control"
    >{{isOtherSelected ? question.otherText : question.displayValue}}</div>
    <survey-other-choice v-show="isOtherSelected" :question="question" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionDropdownModel } from "../question_dropdown";

@Component
export class Dropdown extends QuestionVue<QuestionDropdownModel> {
  get isOtherSelected() {
    const question = this.question;
    return question.hasOther && question.isOtherSelected;
  }
}
Vue.component("survey-dropdown", Dropdown);
export default Dropdown;
</script>
