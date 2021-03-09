<template>
  <div :class="css.progressButtonsContainerCenter">
    <div :class="css.progressButtonsContainer">
      <div
        :class="getScrollButtonCss(hasScroller, true)"
        v-on:click="clickScrollButton(true)"
        role="button"
      ></div>
      <div
        :class="css.progressButtonsListContainer"
        ref="progressButtonsListContainer"
      >
        <ul :class="css.progressButtonsList">
          <li
            v-for="(page, index) in survey.visiblePages"
            :key="'listelement' + index"
            :class="getListElementCss(index)"
            v-on:click="
              isListElementClickable(index) ? clickListElement(index) : null
            "
          >
            <div
              :class="css.progressButtonsPageTitle"
              :title="page.locNavigationTitle.renderedHtml || page.name"
            >
              {{ page.locNavigationTitle.renderedHtml || page.name }}
            </div>
            <div
              :class="css.progressButtonsPageDescription"
              :title="page.locNavigationDescription.renderedHtml"
            >
              {{ page.locNavigationDescription.renderedHtml }}
            </div>
          </li>
        </ul>
      </div>
      <div
        :class="getScrollButtonCss(hasScroller, false)"
        v-on:click="clickScrollButton(false)"
        role="button"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel } from "survey-core";
import { SurveyProgressButtonsModel } from "survey-core";

@Component
export class ProgressButtons extends Vue {
  @Prop() survey: SurveyModel;
  @Prop() css: any;
  public hasScroller: boolean = false;
  private progressButtonsModel: SurveyProgressButtonsModel;
  private updateScroller: any = undefined;
  constructor() {
    super();
    this.progressButtonsModel = new SurveyProgressButtonsModel(this.survey);
  }
  mounted() {
    let listContainerElement: any = this.$refs["progressButtonsListContainer"];
    this.updateScroller = setInterval(() => {
      this.hasScroller =
        listContainerElement.scrollWidth > listContainerElement.offsetWidth;
    }, 100);
  }
  public isListElementClickable(index: number): boolean {
    return this.progressButtonsModel.isListElementClickable(index);
  }
  public getListElementCss(index: number): string {
    return this.progressButtonsModel.getListElementCss(index);
  }
  public clickListElement(index: number): void {
    this.progressButtonsModel.clickListElement(index);
  }
  public getScrollButtonCss(hasScroller: boolean, isLeftScroll: boolean): any {
    let scrollCss: string = isLeftScroll
      ? this.css.progressButtonsImageButtonLeft
      : this.css.progressButtonsImageButtonRight;
    if (!hasScroller)
      scrollCss += " " + this.css.progressButtonsImageButtonHidden;
    return scrollCss;
  }
  public clickScrollButton(isLeftScroll: boolean): void {
    let listContainerElement: any = this.$refs["progressButtonsListContainer"];
    listContainerElement.scrollLeft += (isLeftScroll ? -1 : 1) * 70;
  }
  beforeDestroy() {
    if (typeof this.updateScroller !== "undefined") {
      clearInterval(this.updateScroller);
      this.updateScroller = undefined;
    }
  }
}

Vue.component("sv-progress-buttons", ProgressButtons);
export default ProgressButtons;
</script>
