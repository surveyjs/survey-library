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
    <span :class="question.getDetailPanelIconCss(row)"></span>
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { AdaptiveActionBarItemWrapper } from "../../../../action-bar";
import { Base } from "../../../../base";
import BaseVue from "../../../base";

@Component
export class DetailButton extends BaseVue {
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

Vue.component("sv-matrix-detail-button", DetailButton);
export default DetailButton;
</script>
