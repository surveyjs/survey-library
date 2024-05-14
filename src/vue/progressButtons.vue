<template>
  <div :class="model.getRootCss(container)"  :style="{'maxWidth': model.progressWidth}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="progress">
    <div v-if="canShowHeader" :class="survey.css.progressButtonsHeader">
      <div :class="survey.css.progressButtonsPageTitle" :title="model.headerText">{{ model.headerText }}</div>
    </div>
    <div :class="css.progressButtonsContainer">
      <div
        :class="model.getScrollButtonCss(hasScroller, true)"
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
            :class="model.getListElementCss(index)"
            v-on:click="
              model.isListElementClickable(index) ? model.clickListElement(page) : null
            "
            :data-page-number="model.getItemNumber(page)"
          >
            <div :class="css.progressButtonsConnector"></div>
            <div v-if="canShowItemTitles"
              :class="css.progressButtonsPageTitle"
              :title="page.renderedNavigationTitle"
            >
              <survey-string :locString="page.locNavigationTitle" />
            </div>
            <div v-if="canShowItemTitles"
              :class="css.progressButtonsPageDescription"
              :title="page.locNavigationDescription.renderedHtml"
            >
              {{ page.locNavigationDescription.renderedHtml }}
            </div>
            <div :class="css.progressButtonsButton"><div :class="css.progressButtonsButtonBackground"></div><div :class="css.progressButtonsButtonContent"></div><span>{{model.getItemNumber(page)}}</span></div>
          </li>
        </ul>
      </div>
      <div
        :class="model.getScrollButtonCss(hasScroller, false)"
        v-on:click="clickScrollButton(false)"
        role="button"
      ></div>
    </div>
    <div v-if="canShowFooter" :class="survey.css.progressButtonsFooter">
      <div :class="survey.css.progressButtonsPageTitle" :title="model.footerText">{{ model.footerText }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel, ProgressButtons, ProgressButtonsResponsivityManager, IProgressButtonsViewModel } from "survey-core";

@Component
export class ProgressButtonsComponent extends Vue implements IProgressButtonsViewModel {
  private respManager: ProgressButtonsResponsivityManager;
  @Prop() survey: SurveyModel;
  @Prop() model: ProgressButtons;
  @Prop() container: string;
  public hasScroller: boolean = false;
  public canShowHeader: boolean = false;
  public canShowFooter: boolean = false;
  public canShowItemTitles: boolean = true;
  constructor() {
    super();
  }
  onResize(canShowItemTitles: boolean): void {
    this.canShowItemTitles = canShowItemTitles;
    this.canShowHeader = !this.canShowItemTitles;
  }
  onUpdateScroller(hasScroller: boolean): void {
    this.hasScroller = hasScroller;
  }
  onUpdateSettings(): void {
    this.canShowItemTitles = this.model.showItemTitles;
    this.canShowFooter = !this.model.showItemTitles;
  }

  public get css() {
    return this.survey.css;
  }
  mounted() {
    const element: any = this.$refs["progressButtonsListContainer"];
    this.respManager = new ProgressButtonsResponsivityManager(this.model, element, this);
  }
  public clickScrollButton(isLeftScroll: boolean): void {
    let listContainerElement: any = this.$refs["progressButtonsListContainer"];
    listContainerElement.scrollLeft += (isLeftScroll ? -1 : 1) * 70;
  }
  beforeDestroy() {
    this.respManager.dispose();
  }
}

Vue.component("sv-progress-buttons", ProgressButtonsComponent);
export default ProgressButtonsComponent;
</script>
