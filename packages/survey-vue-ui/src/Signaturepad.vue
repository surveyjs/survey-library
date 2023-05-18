<template>
  <div
    :class="question.cssClasses.root"
    v-bind:style="{
      height: question.signatureHeight + 'px',
      width: question.signatureWidth + 'px',
    }"
  >
    <div :class="question.cssClasses.placeholder" v-show="question.needShowPlaceholder()">
      {{ question.placeHolderText }}
    </div>
    <div>
      <canvas tabindex="0"></canvas>
    </div>
    <div :class="question.cssClasses.controls" v-if="question.canShowClearButton">
      <button
        type="button"
        :class="question.cssClasses.clearButton"
        :title="question.clearButtonCaption"
        v-on:click="
          () => {
            question.clearValue();
          }
        "
      >
        <span v-if="!question.cssClasses.clearButtonIconId">✖</span>
        <sv-svg-icon
          v-if="question.cssClasses.clearButtonIconId"
          :iconName="question.cssClasses.clearButtonIconId"
          :size="'auto'"
        ></sv-svg-icon>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { QuestionSignaturePadModel } from "survey-core";
import { defineQuestionComponent } from "./base";

export default defineQuestionComponent({
  // eslint-disable-next-line
  name: "survey-signaturepad",
  props: {
    question: QuestionSignaturePadModel,
    css: Object,
  },
});

</script>
