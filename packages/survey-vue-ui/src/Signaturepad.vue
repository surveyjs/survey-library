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
import { defineSurveyComponent } from "./base";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "survey-signaturepad",
  props: {
    question: QuestionSignaturePadModel,
    css: Object,
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.question; },
    }
  },
  computed: {
  },
  mounted() {
    if (this.question) {
      this.question.afterRenderQuestionElement(this.$el as HTMLElement);
    }
  },
  unmounted() {
    if (this.question) {
      this.question.beforeDestroyQuestionElement(this.$el as HTMLElement);
    }
  }
});

</script>
