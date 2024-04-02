<template>
  <div :class="page.cssRoot">
    <survey-element-title :element="page" :css="css"/>
    <div v-if="showDescription" :class="page.cssClasses.page.description">
      <survey-string :locString="page.locDescription" />
    </div>
    <survey-errors :element="page" />
    <template v-for="(row, index) in rows">
      <survey-row
      v-if="row.visible"
      :key="page.id + '_' + index"
      :row="row"
      :survey="survey"
      :css="css">
      </survey-row>
    </template>
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

  protected getModel(): Base {
    return this.page;
  }
  protected onMounted() {
    if (this.survey) {
      this.survey.afterRenderPage(this.$el as HTMLElement);
    }
  }
  //protected onUpdated() {
  //  this.survey.afterRenderPage(this.$el as HTMLElement);
  //}
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
