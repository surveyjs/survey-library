<template>
  <div class="sv-vue-row-additional-div">
    <survey-element
      v-if="row.isNeedRender && element.isVisible"
      v-for="element in row.elements"
      :key="element.idValue"
      :id="element.id"
      :role="element.ariaRole"
      :aria-labelledby="element.hasTitle ? element.ariaTitleId : null"
      :name="element.name"
      :style="{
        paddingLeft: element.paddingLeft,
        paddingRight: element.paddingRight,
        flexBasis: element.renderWidth,
        flexGrow: 1,
        flexShrink: 1,
        width: element.renderWidth,
        minWidth: element.minWidth,
        maxWidth: element.maxWidth,
        display: 'inline-block',
      }"
      :element="element"
      :survey="survey"
      :css="css"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel } from "survey-core";
import { PanelModelBase, PanelModel, QuestionRowModel } from "survey-core";
import { VueSurveyModel } from "./surveyModel";
import { settings } from "survey-core";
import { BaseVue } from "./base";
import { Base } from "survey-core";

@Component
export class Row extends BaseVue {
  @Prop() row: QuestionRowModel;
  @Prop() css: any;
  @Prop() survey: SurveyModel;

  protected getModel(): Base {
    return this.row;
  }
  protected onMounted() {
    if (!!this.row) {
      if (!this.row.isNeedRender) {
        var rowContainerDiv = this.$el;
        setTimeout(() => {
          this.row.startLazyRendering(rowContainerDiv as HTMLElement);
        }, 10);
      }
    }
  }
  beforeDestroy() {
    if (!!this.row) {
      this.row.isNeedRender = !this.row.isLazyRendering;
    }
  }
}
Vue.component("survey-row", Row);
export default Row;
</script>
