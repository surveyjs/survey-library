<template>
  <div :class="model.containerCss">
      <div v-if="model.isMobile" v-on:click="model.togglePopup" v-key2click>
          <sv-svg-icon :iconName="model.icon" :size="24"></sv-svg-icon>
          <sv-popup :model="model.popupModel"></sv-popup>
      </div>
      <sv-list v-else :model="model.listModel"></sv-list>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel, createTOCListModel, getTocRootCss, TOCModel } from "survey-core";

@Component
export class ProgressToc extends Vue {
  @Prop() model: TOCModel;
  @Prop() survey: SurveyModel;
  @Prop() css: any;
  constructor() {
    super();
  }
}

Vue.component("sv-navigation-toc", ProgressToc);
export default ProgressToc;
</script>
