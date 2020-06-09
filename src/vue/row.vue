<template>
  <div class="sv-vue-row-additional-div">
    <survey-element
      v-if="element.visible"
      v-for="element in row.elements"
      :key="element.idValue"
      :id="element.id"
      :role="element.ariaRole"
      :aria-labelledby="element.hasTitle ? element.ariaTitleId : null"
      :name="element.name"
      :style="{ paddingLeft: element.paddingLeft, paddingRight: element.paddingRight, flexBasis: element.renderWidth, flexGrow: 1, flexShrink: 1, width: element.renderWidth, minWidth: element.minWidth, maxWidth: element.maxWidth, display: 'inline-block' }"
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