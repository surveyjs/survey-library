<template>
  <div :class="tocModel.containerCss">
      <div v-if="tocModel.isMobile" v-on:click="tocModel.togglePopup" v-key2click>
          <sv-svg-icon :iconName="tocModel.icon" :size="24"></sv-svg-icon>
          <sv-popup :model="tocModel.popupModel"></sv-popup>
      </div>
      <sv-list v-else :model="tocModel.listModel"></sv-list>
  </div>  
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel, createTOCListModel, getTocRootCss, TOCModel } from "survey-core";

@Component
export class ProgressToc extends Vue {
  @Prop() survey: SurveyModel;
  @Prop() css: any;
  public tocModel: any = undefined;
  constructor() {
    super();
    this.tocModel = new TOCModel(this.survey);
  }
}

Vue.component("sv-progress-toc", ProgressToc);
export default ProgressToc;
</script>
