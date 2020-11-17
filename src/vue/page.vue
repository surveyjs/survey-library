<template>
  <div :class="page.cssClasses.page.root">
    <h4 v-if="showHeader" :class="page.cssClasses.page.title">
      <survey-string :locString="page.locTitle" />
    </h4>
    <div v-if="showDescription" :class="page.cssClasses.page.description">
      <survey-string :locString="page.locDescription" />
    </div>
    <div
      v-for="(row, index) in rows"
      v-if="row.visible"
      :key="page.id + '_' + index"
      :class="css.row"
    >
      <survey-row :row="row" :survey="survey" :css="css"></survey-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel } from "../survey";
import { PageModel } from "../page";
import { Base } from "../base";
import { PanelModelBase, PanelModel, QuestionRowModel } from "../panel";
import {BaseVue} from "./base";

@Component
export class Page extends BaseVue {
  @Prop survey: SurveyModel;
  @Prop page: PageModel;
  @Prop css: Object;

  isCurrentPageChanged: boolean = false;
  protected getModel(): Base { return this.page; }
  protected onMounted() {
    if (this.survey) {
      this.survey.afterRenderPage(this.$el);

      this.survey.onCurrentPageChanged.add((sender, options) => {
        this.isCurrentPageChanged = true;
      });
    }
  }
  protected onUpdated() {
    var self = this;
    self.survey.afterRenderPage(this.$el);
    this.$nextTick(function() {
      if (this.isCurrentPageChanged) {
        this.isCurrentPageChanged = false;
        self.survey.scrollToTopOnPageChange();
      }
    });
  }
  get showHeader() {
    return this.page._showTitle;
  }
  get showDescription() {
    return this.page._showDescription;
  }
  get num() {
    return this.page.num > 0 ? this.page.num + ". " : "";
  }
  get rows() {
    return this.page.rows;
  }
}
Vue.component("survey-page", Page);
export default Page;
</script>
