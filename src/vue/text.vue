<template>
  <div v-if="question.isReadOnlyRenderDiv()">{{ question.value }}</div>
  <div v-else-if="question.dataListId">
    <input
      :disabled="question.isInputReadOnly"
      :class="question.getControlClass()"
      :type="question.inputType"
      :maxlength="question.getMaxLength()"
      :min="question.renderedMin"
      :max="question.renderedMax"
      :step="question.renderedStep"
      :size="question.renderedInputSize"
      :style="inputStyle"
      :id="question.inputId"
      :list="question.dataListId"
      :placeholder="question.renderedPlaceholder"
      :autocomplete="question.autocomplete"
      :value="question.value"
      @change="change"
      @keyup="keyup"
      :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel"
      :aria-invalid="question.ariaInvalid"
      :aria-describedby="question.ariaDescribedBy"
    /><datalist :id="question.dataListId">
      <option v-for="item in question.dataList" :value="item"></option>
    </datalist>
  </div>
  <input
    v-else
    :disabled="question.isInputReadOnly"
    :class="question.getControlClass()"
    :type="question.inputType"
    :maxlength="question.getMaxLength()"
    :min="question.renderedMin"
    :max="question.renderedMax"
    :step="question.renderedStep"
    :size="question.renderedInputSize"
    :style="inputStyle"
    :id="question.inputId"
    :list="question.dataListId"
    :placeholder="question.renderedPlaceholder"
    :autocomplete="question.autocomplete"
    :value="question.value"
    @change="change"
    @keyup="keyup"
    :aria-required="question.ariaRequired"
    :aria-label="question.ariaLabel"
    :aria-invalid="question.ariaInvalid"
    :aria-describedby="question.ariaDescribedBy"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionTextModel } from "survey-core";

@Component
export class QuestionText extends QuestionVue<QuestionTextModel> {
  change(event: any) {
    this.question.value = event.target.value;
  }
  keyup(event: any) {
    if (!this.question.isInputTextUpdate) return;
    this.question.value = event.target.value;
  }
  get inputStyle(): any {
    return this.question.inputStyle;
  }
}
Vue.component("survey-text", QuestionText);
export default QuestionText;
</script>
