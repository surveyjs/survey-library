<template>
  <div :class="containerCss">
    <sv-list :model="listModel"></sv-list>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel, createTOCListModel } from "survey-core";

@Component
export class ProgressToc extends Vue {
  @Prop() survey: SurveyModel;
  @Prop() css: any;
  containerCss = "sv_progress-toc";
  public listModel: any = undefined;
  constructor() {
    super();
    this.listModel = createTOCListModel(this.survey);
  }
}

Vue.component("sv-progress-toc", ProgressToc);
export default ProgressToc;
</script>
