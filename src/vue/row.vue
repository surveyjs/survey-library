<template>
  <div>
    <component
      v-if="element.visible"
      v-for="element in row.elements"
      :key="element.idValue"
      v-bind:is="getElementName(element)"
      :id="element.id"
      :style="{ paddingLeft: element.paddingLeft, paddingRight: element.paddingRight, width: element.renderWidth }"
      :question="element"
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
import { IElement } from "../base";

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
  getElementName(element: IElement): string {
    if (!element.isPanel) return "survey-element";
    return "survey-" + element.getType();
  }
}
Vue.component("survey-row", Row);
export default Row;
</script>
