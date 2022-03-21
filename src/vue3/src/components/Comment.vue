<script setup lang="ts">
import { Question, Model } from "survey-core";

defineProps<{
  value: string
}>()

var json = {
    "elements": [
        {
          "type": "comment",
          "name": "comment1"
        }
    ]
};

const survey = new Model(json);
const question = survey.getAllQuestions()[0];

window.survey = survey;

function change(event: any) {
  question.value = event.target.value;
}

</script>

<template>
  <textarea
      v-if="!question.isReadOnlyRenderDiv()"
      :readonly="question.isInputReadOnly"
      :disabled="question.renderedInputDisabled"
      :value="question.value"
      :id="question.inputId"
      :maxlength="question.getMaxLength()"
      :cols="question.cols"
      :rows="question.rows"
      :placeholder="question.renderedPlaceHolder"
      :class="question.className"
      @change="change"
      @input="(e) => { question.onInput(e) }"
      @keydown="(e) => { question.onKeyDown(e) }"
      :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel"
      :aria-invalid="question.ariaInvalid"
      :aria-describedby="question.ariaDescribedBy"
      v-bind:style="{ resize: question.resizeStyle }"
    ></textarea>
    <div v-else>{{ question.value }}</div>
</template>
