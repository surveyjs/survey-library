<template>
  <div :class="css.footer">
    <input
      type="button"
      :value="survey.pagePrevText"
      v-show="!survey.isFirstPage && survey.isShowPrevButton"
      :class="survey.cssNavigationPrev"
      @click="prevPage"
    />
    <input
      type="button"
      :value="survey.pageNextText"
      v-show="!survey.isLastPage"
      :class="survey.cssNavigationNext"
      @click="nextPage"
    />
    <input
      v-if="survey.isPreviewButtonVisible"
      type="button"
      :value="survey.previewText"
      v-show="survey.isLastPage"
      :class="survey.cssNavigationPreview"
      @click="showPreview"
    />
    <input
      v-if="survey.isCompleteButtonVisible"
      type="button"
      :value="survey.completeText"
      v-show="survey.isLastPage"
      :class="survey.cssNavigationComplete"
      @click="completeLastPage"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel } from "../survey";

@Component
export class Navigation extends Vue {
  @Prop survey: SurveyModel;
  @Prop css: any;
  prevPage() {
    this.survey.prevPage();
  }
  nextPage() {
    this.survey.nextPage();
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
