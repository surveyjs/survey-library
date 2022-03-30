<template>
  <div :class="row.getRowCss()">
    <div v-for="element in row.visibleElements" :style="element.rootStyle">
    <survey-element
      
      :key="element.id"
      
      :element="element"
      :survey="survey"
      :css="css"
      :row="row"
      :style="{
          paddingLeft: element.paddingLeft,
          paddingRight: element.paddingRight,
        }"
    >
    </survey-element>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel } from "survey-core";
import { QuestionRowModel } from "survey-core";
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
      this.row.isNeedRender = !this.row.isLazyRendering();
    }
  }
}
Vue.component("survey-row", Row);
export default Row;
</script>
