<template>
  <button
    type="button"
    :class="question.getDetailPanelButtonCss(row)"
    @click="() => row.showHideDetailPanelClick()"
    v-bind:aria-expanded="
      question.getIsDetailPanelShowing(row) ? 'true' : 'false'
    "
    :aria-controls="
      question.getIsDetailPanelShowing(row) ? row.detailPanelId : null
    "
  >
  <sv-svg-icon
    :class="this.question.getDetailPanelIconCss(this.row)"
    :iconName="this.question.getDetailPanelIconId(this.row)"
    size="auto"
  >
  </sv-svg-icon>
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { Action } from "survey-core";
import { Base } from "survey-core";
import BaseVue from "../../../base";

@Component
export class SurveyQuestionMatrixDetailButton extends BaseVue {
  @Prop() public item: Action;

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

Vue.component("sv-matrix-detail-button", SurveyQuestionMatrixDetailButton);
export default SurveyQuestionMatrixDetailButton;
</script>
