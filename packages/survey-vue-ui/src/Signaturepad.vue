<template>
  <div
    :class="question.cssClasses.root"
    ref="root"
    v-bind:style="{
      height: question.signatureHeight + 'px',
      width: question.signatureWidth + 'px',
    }"
  >
    <div
      :class="question.cssClasses.placeholder"
      v-show="question.needShowPlaceholder()"
    >
      {{ question.placeHolderText }}
    </div>
    <div>
      <canvas tabindex="0"></canvas>
    </div>
    <div
      :class="question.cssClasses.controls"
      v-if="question.canShowClearButton"
    >
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

<script setup lang="ts">
import type { QuestionSignaturePadModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
const props = defineProps<{
  question: QuestionSignaturePadModel;
}>();
const root = ref(null);
useQuestion<QuestionSignaturePadModel>(props, root);
</script>
