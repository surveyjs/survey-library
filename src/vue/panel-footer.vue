<template>
    <div v-if="panel.hasEditButton" :class="panel.cssClasses.panel.footer">
      <input
        type="button"
        :value="survey.editText"
        :class="survey.cssNavigationEdit"
        @click="cancelPreview"
      />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { PanelModel, Base, doKey2ClickUp, ISurvey, QuestionRowModel } from "survey-core";
import { BaseVue } from "./base";

@Component
export class PanelFooter extends BaseVue {
  @Prop() panel: PanelModel;

  get survey(): ISurvey {
    return this.panel.survey;
  }
  cancelPreview() {
    this.panel.cancelPreview();
  }
}
Vue.component("sv-panel-footer", PanelFooter);
export default PanelFooter;
</script>
