<script setup lang="ts">
import { QuestionCommentModel } from "survey-core";
import {toRefs} from "vue";
import {makeReactive} from "./base";

const props = defineProps<{
  question: QuestionCommentModel
}>();

function change(event: any) {
  props.question.value = event.target.value;
}
makeReactive(props.question);
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