<template>
  <div
    :class="question.cssClasses.root"
    ref="root"
    v-bind:style="{
      width: question.renderedCanvasWidth,
    }"
  >
    <div
      :class="question.cssClasses.placeholder"
      v-show="question.needShowPlaceholder()"
    >
      <SvComponent
        :is="'survey-string'"
        :locString="question.locRenderedPlaceholder"
      ></SvComponent>
    </div>
    <div>
      <img
        v-if="question.backgroundImage"
        :class="question.cssClasses.backgroundImage"
        :src="question.backgroundImage"
        v-bind:style="{
          width: question.renderedCanvasWidth,
        }"
      />
      <canvas
        tabindex="-1"
        :class="question.cssClasses.canvas"
        @blur="question.onBlur"
      ></canvas>
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
            question.clearValue(true);
          }
        "
      >
        <span v-if="!question.cssClasses.clearButtonIconId">✖</span>
        <SvComponent
          :is="'sv-svg-icon'"
          v-if="question.cssClasses.clearButtonIconId"
          :iconName="question.cssClasses.clearButtonIconId"
          :size="'auto'"
        ></SvComponent>
      </button>
    </div>
    <div
      :class="question.cssClasses.loadingIndicator"
      v-if="question.showLoadingIndicator"
    >
      <SvComponent :is="'sv-loading-indicator'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SvComponent from "@/SvComponent.vue";
import type { QuestionSignaturePadModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  question: QuestionSignaturePadModel;
}>();
const root = ref(null);
useQuestion<QuestionSignaturePadModel>(props, root);
</script>
