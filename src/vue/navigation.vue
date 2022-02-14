<template>
  <div :class="css.footer">
    <input
      v-if="survey.isShowStartingPage"
      type="button"
      :value="survey.locStartSurveyText.text"
      :class="survey.cssNavigationStart"
      @click="start"
    />
    <input
      v-if="survey.isShowPrevButton"
      type="button"
      :value="survey.locPagePrevText.text"
      :class="survey.cssNavigationPrev"
      @mousedown="buttonMouseDown"
      @click="prevPage"
    />
    <input
      v-if="survey.isShowNextButton"
      type="button"
      :value="survey.locPageNextText.text"
      :class="survey.cssNavigationNext"
      @mousedown="nextButtonMouseDown"
      @click="nextPage"
    />
    <input
      v-if="survey.isPreviewButtonVisible"
      type="button"
      :value="survey.locPreviewText.text"
      :class="survey.cssNavigationPreview"
      @mousedown="buttonMouseDown"
      @click="showPreview"
    />
    <input
      v-if="survey.isCompleteButtonVisible"
      type="button"
      :value="survey.locCompleteText.text"
      :class="survey.cssNavigationComplete"
      @mousedown="buttonMouseDown"
      @click="completeLastPage"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { SurveyModel, Base, PageModel } from "survey-core";
import { BaseVue } from "./base";

@Component
export class Navigation extends BaseVue {
  @Prop() survey: SurveyModel;
  @Prop() css: any;
  protected getModel(): Base {
    return this.survey;
  }
  nextButtonMouseDown() {
    return this.survey.nextPageMouseDown();
  }
  buttonMouseDown() {
    return this.survey.navigationMouseDown();
  }
  start() {
    this.survey.start();
  }
  prevPage() {
    this.survey.prevPage();
  }
  nextPage() {
    this.survey.nextPageUIClick();
  }
  completeLastPage() {
    this.survey.completeLastPage();
  }
  showPreview() {
    this.survey.showPreview();
  }
}
Vue.component("survey-navigation", Navigation);
export default Navigation;
</script>
