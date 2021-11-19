<template>
  <div :class="question.renderCssRoot">
    <div v-if="!question.isReadOnly" :class="question.cssClasses.selectWrapper">
      <select
        :id="question.inputId"
        v-model="question.renderedValue"
        :autocomplete="question.autoComplete"
        :class="question.getControlClass()"
        :aria-required="question.ariaRequired"
        :aria-label="question.ariaLabel"
        :aria-invalid="question.ariaInvalid"
        :aria-describedby="question.ariaDescribedBy"
        :required="question.isRequired"
      >
        <option v-if="question.showOptionsCaption" :value="undefined">{{ question.optionsCaption }}</option><option
          v-for="item in question.visibleChoices"
          :value="item.value"
          :disabled="!item.isEnabled"
        >{{ item.text }}</option>
      </select>
    </div><div
      disabled
      v-else
      :id="question.inputId"
      :class="question.getControlClass()"
    >{{ question.isOtherSelected ? question.otherText : question.displayValue }}</div><survey-other-choice v-if="question.isOtherSelected" :question="question" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionDropdownModel } from "survey-core";

@Component
export class Dropdown extends QuestionVue<QuestionDropdownModel> {
}
Vue.component("survey-dropdown", Dropdown);
export default Dropdown;
</script>
