<template>
  <button
    type="button"
    :class="question.cssClasses.button + ' ' + question.cssClasses.buttonRemove"
    :disabled="question.isInputReadOnly"
    @click="() => question.removeRowUI(row)"
  >
    <survey-string :locString="question.locRemoveRowText" />
    <span :class="question.cssClasses.iconRemove"></span>
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { AdaptiveActionBarItemWrapper } from "survey-core";
import { Base } from "survey-core";
import BaseVue from "../../../base";

@Component
export class SurveyQuestionMatrixDynamicRemoveButton extends BaseVue {
  @Prop() public item: AdaptiveActionBarItemWrapper;

  get question() {
    return this.item.data.question;
  }

  get row() {
    return this.item.data.row;
  }

  getModel(): Base {
    return this.item;
  }
}

Vue.component(
  "sv-matrix-remove-button",
  SurveyQuestionMatrixDynamicRemoveButton
);
export default SurveyQuestionMatrixDynamicRemoveButton;
</script>
