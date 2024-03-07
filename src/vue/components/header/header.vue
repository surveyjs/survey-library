<template>
  <div :class="model.headerClasses" :style="{ 'height': model.renderedHeight }">
    <div v-if="!!model.backgroundImage" :class="model.backgroundImageClasses" :style="model.backgroundImageStyle"></div>
    <div v-if="!survey.isMobile" :class="model.contentClasses" :style="{ maxWidth: model.maxWidth }">
    <sv-header-cell
      v-for="(cell, index) in model.cells"
      v-bind:key="index"
      :model="cell"
    ></sv-header-cell>
    </div>
    <div v-if="survey.isMobile">
    <sv-header-mobile :model="model"></sv-header-mobile>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import { Base, SurveyModel, Cover, CoverCell } from "survey-core";
import { BaseVue } from "../../base";

export * from "./header-cell.vue";
export * from "./header-mobile.vue";

@Component
export class HeaderViewModel extends BaseVue {
  @Prop() model: Cover;
  @Prop() survey: SurveyModel;
  constructor(props: any) {
    super(props);
  }
  getModel(): Cover {
    this.model.survey = this.survey;
    return this.model;
  }
}

Vue.component("sv-header", HeaderViewModel);
export default HeaderViewModel;
</script>
