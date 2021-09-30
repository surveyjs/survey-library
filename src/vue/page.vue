<template>
  <div :class="page.cssClasses.page.root">
    <survey-element-title :element="page" :css="css"/>
    <div v-if="showDescription" :class="page.cssClasses.page.description">
      <survey-string :locString="page.locDescription" />
    </div>
    <div
      v-for="(row, index) in rows"
      v-if="row.visible"
      :key="page.id + '_' + index"
      :class="row.getRowCss()"
    >
      <survey-row :row="row" :survey="survey" :css="css"></survey-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { SurveyModel } from "survey-core";
import { PageModel } from "survey-core";
import { Base } from "survey-core";
import { BaseVue } from "./base";

@Component
export class Page extends BaseVue {
  @Prop() survey: SurveyModel;
  @Prop() page: PageModel;
  @Prop() css: Object;

  isCurrentPageChanged: boolean = false;
  @Watch("page")
  onPagePropertyChanged(value: string, oldValue: string) {
    this.isCurrentPageChanged = true;
  }
  protected getModel(): Base {
    return this.page;
  }
  protected onMounted() {
    if (this.survey) {
      this.survey.afterRenderPage(this.$el as HTMLElement);
    }
  }
  protected onUpdated() {
    var self = this;
    self.survey.afterRenderPage(this.$el as HTMLElement);
    this.$nextTick(function() {
      if (this.isCurrentPageChanged) {
        this.isCurrentPageChanged = false;
        self.survey.scrollToTopOnPageChange();
      }
    });
  }
  get showDescription() {
    return this.page._showDescription;
  }
  get num() {
    return this.page.num > 0 ? this.page.num + ". " : "";
  }
  get rows(): Array<any> {
    return this.page.rows;
  }
}
Vue.component("survey-page", Page);
export default Page;
</script>
