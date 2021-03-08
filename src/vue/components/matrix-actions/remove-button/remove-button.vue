<template>
  <button
    type="button"
    :class="question.cssClasses.button + ' ' + question.cssClasses.buttonRemove"
    @click="() => question.removeRowUI(row)"
  >
    <span>{{ question.removeRowText }}</span>
    <span :class="question.cssClasses.iconRemove"></span>
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { AdaptiveActionBarItemWrapper } from "../../../../action-bar";
import { Base } from "../../../../base";
import BaseVue from "../../../base";

@Component
export class SurveyQuestionMatrixDynamicRemoveButton extends BaseVue {
  @Prop
  public item: AdaptiveActionBarItemWrapper;

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

Vue.component("sv-matrix-remove-button", SurveyQuestionMatrixDynamicRemoveButton);
export default SurveyQuestionMatrixDynamicRemoveButton;
</script>
