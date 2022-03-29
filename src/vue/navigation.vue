<template>
  <div :class="css.footer">
    <sv-action-bar :model="navigationBar"></sv-action-bar>
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
  public get navigationBar(): Base {
    return this.survey.navigationBar;
  }
}
Vue.component("survey-navigation", Navigation);
export default Navigation;
</script>
