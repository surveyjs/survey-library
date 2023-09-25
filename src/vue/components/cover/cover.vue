<template>
  <div :class="model.coverClasses" :style="{ 'height': model.renderedHeight, 'backgroundColor': model.backgroundColor }">
    <div v-if="!!model.backgroundImage" :class="model.backgroundImageClasses" :style="model.backgroundImageStyle"></div>
    <div :class="model.contentClasses">
    <sv-cover-cell
      v-for="cell in model.cells"
      :model="cell"
    ></sv-cover-cell>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import { Base, SurveyModel, Cover, CoverCell } from "survey-core";
import { BaseVue } from "../../base";

export * from "./cover-cell.vue";

@Component
export class CoverViewModel extends BaseVue {
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

Vue.component("sv-cover", CoverViewModel);
export default CoverViewModel;
</script>
