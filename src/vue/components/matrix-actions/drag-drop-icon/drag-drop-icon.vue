<template>
  <span :class="question.cssClasses.iconDrag"></span>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { Action } from "survey-core";
import { Base } from "survey-core";
import BaseVue from "../../../base";

@Component
export class SurveyQuestionMatrixDynamicDragDropIcon extends BaseVue {
  @Prop() public item: Action;

  get question() {
    return this.item.data.question;
  }

  getModel(): Base {
    return this.item;
  }
}

Vue.component(
  "sv-matrix-drag-drop-icon",
  SurveyQuestionMatrixDynamicDragDropIcon
);
export default SurveyQuestionMatrixDynamicDragDropIcon;
</script>
