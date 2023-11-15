<template>
  <div :class="question.getCommentAreaCss(true)">
    <textarea
      v-if="!question.isReadOnlyRenderDiv()"
      :id="question.otherId"
      :readonly="question.isInputReadOnly"
      :disabled="question.isInputReadOnly"
      :class="question.cssClasses.other || commentClass"
      :value="question.otherValue"
      :maxlength="question.getOthersMaxLength()"
      :placeholder="question.otherPlaceholder"
      :aria-label="question.ariaLabel || question.a11y_input_ariaLabel"
      :aria-required="question.ariaRequired || question.a11y_input_ariaRequired"
      v-bind:style="{ resize: question.resizeStyle }"
      @change="(e) => { question.onOtherValueChange(e) }"
      @input="(e) => { question.onOtherValueInput(e) }"
    /><div v-if="question.isReadOnlyRenderDiv()">{{ question.otherValue }}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question } from "survey-core";

@Component
export class OtherChoice extends Vue {
  @Prop() question: Question;
  @Prop() commentClass: any;
}
Vue.component("survey-other-choice", OtherChoice);
export default OtherChoice;
</script>
