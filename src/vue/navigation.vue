<template>
  <div :class="css.footer">
    <input
      type="button"
      :value="survey.pagePrevText"
      v-show="showPrevBtn"
      :class="survey.cssNavigationPrev"
      @mousedown="buttonMouseDown"
      @click="prevPage"
    />
    <input
      type="button"
      :value="survey.pageNextText"
      v-show="showNextBtn"
      :class="survey.cssNavigationNext"
      @mousedown="nextButtonMouseDown"
      @click="nextPage"
    />
    <input
      v-if="survey.isPreviewButtonVisible"
      type="button"
      :value="survey.previewText"
      v-show="survey.isLastPage"
      :class="survey.cssNavigationPreview"
      @mousedown="buttonMouseDown"
      @click="showPreview"
    />
    <input
      v-if="survey.isCompleteButtonVisible"
      type="button"
      :value="survey.completeText"
      v-show="showCompleteBtn"
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
  private mouseDownPage: PageModel;
  showPrevBtn: boolean = true;
  showNextBtn: boolean = true;
  showCompleteBtn: boolean = true;
  @Prop() survey: SurveyModel;
  @Prop() css: any;
  protected getModel(): Base {
    return this.survey;
  }
  @Watch("survey")
  onPropertyChanged(value: string, oldValue: string) {
    this.onCreated();
    this.updateShowButtons();
  }
  protected onMounted() {
    this.survey.onCurrentPageChanged.add((sender, options) => {
      this.updateShowButtons();
    });
    this.updateShowButtons();
  }
  private updateShowButtons() {
    this.showPrevBtn = !this.survey.isFirstPage && this.survey.isShowPrevButton;
    this.showNextBtn = !this.survey.isLastPage;
    this.showCompleteBtn = this.survey.isLastPage;
  }
  nextButtonMouseDown() {
    this.mouseDownPage = this.survey.currentPage;
    return this.survey.navigationMouseDown();
  }
  buttonMouseDown() {
    return this.survey.navigationMouseDown();
  }
  prevPage() {
    this.survey.prevPage();
  }
  nextPage() {
    if (!!this.mouseDownPage && this.mouseDownPage !== this.survey.currentPage)
      return;
    this.mouseDownPage = null;
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
