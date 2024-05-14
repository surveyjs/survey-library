<template>
  <div
    :class="question.cssClasses.root"
    v-bind:style="{
      width: question.renderedCanvasWidth,
    }"
  >
    <div :class="question.cssClasses.placeholder" v-show="question.needShowPlaceholder()">
      <survey-string :locString="question.locRenderedPlaceholder"></survey-string>
    </div>
    <div>
      <img v-if="question.backgroundImage" :class="question.cssClasses.backgroundImage" :src="question.backgroundImage"
        v-bind:style="{
          width: question.renderedCanvasWidth,
        }">
      <canvas tabindex="-1" :class="question.cssClasses.canvas" @blur="question.onBlur"></canvas>
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
    <div
        :class="question.cssClasses.loadingIndicator"
        v-if="question.showLoadingIndicator"
      >
      <sv-loading-indicator></sv-loading-indicator>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionSignaturePadModel } from "survey-core";

@Component
export class SignaturePad extends QuestionVue<QuestionSignaturePadModel> {}
Vue.component("survey-signaturepad", SignaturePad);
export default SignaturePad;
</script>
