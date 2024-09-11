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
    <SvComponent
      :is="'sv-svg-icon'"
      :class="question.getDetailPanelIconCss(row)"
      :iconName="question.getDetailPanelIconId(row)"
      size="auto"
    >
    </SvComponent>
  </button>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { Action } from "survey-core";
import { useMatrixAction } from "../matrix-action";
const props = defineProps<{ item: Action }>();
const { question, row } = useMatrixAction(props);
</script>
