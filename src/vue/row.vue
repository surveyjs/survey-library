<template>
  <div>
    <survey-element
      v-if="element.visible"
      v-for="element in row.elements"
      :key="element.idValue"
      :id="element.id"
      :name="element.name"
      :style="{ paddingLeft: element.paddingLeft, paddingRight: element.paddingRight, width: element.renderWidth, display: 'inline-block' }"
      :element="element"
      :survey="survey"
      :css="css"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel } from "../survey";
import { PanelModelBase, PanelModel, QuestionRowModel } from "../panel";
import { VueSurveyModel } from "./surveyModel";
@Component
export class Row extends Vue {
  @Prop row: any;
  @Prop css: any;
  @Prop survey: SurveyModel;
  mounted() {
    if (!!this.row) {
      VueSurveyModel.updatePropertiesHash(this.row);
    }
  }
}
Vue.component("survey-row", Row);
export default Row;
</script>