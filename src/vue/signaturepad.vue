<template>
  <div 
    :class="question.cssClasses.root"
    v-bind:style="{
      height: question.height + 'px',
      width: question.width + 'px',
    }"
  >
    <div 
      :class="question.cssClasses.placeholder"
      v-show="question.needShowPlaceholder()"
    >
      {{question.placeHolderText}}
    </div>
    <div>
      <canvas tabindex="0"></canvas>
    </div>
    <div :class="question.cssClasses.controls">
      <button
        type="button"
        :class="question.cssClasses.clearButton"
        :title="question.clearButtonCaption"
      >
        <span v-if="!question.cssClasses.clearButtonIconId">✖</span>
        <sv-svg-icon :iconName="question.cssClasses.clearButtonIconId" :size="'auto'"></sv-svg-icon>
      </button>
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
