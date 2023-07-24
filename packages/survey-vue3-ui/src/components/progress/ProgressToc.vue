<template>
  <div :class="tocModel.containerCss">
    <div v-if="tocModel.isMobile" v-on:click="tocModel.togglePopup" v-key2click>
      <sv-svg-icon :iconName="tocModel.icon" :size="24"></sv-svg-icon>
      <sv-popup :model="tocModel.popupModel"></sv-popup>
    </div>
    <sv-list v-else :model="tocModel.listModel"></sv-list>
  </div>
</template>

<script lang="ts" setup>
import { type SurveyModel, TOCModel } from "survey-core";

const props = defineProps<{ survey: SurveyModel }>();
const tocModel = new TOCModel(props.survey);
</script>
