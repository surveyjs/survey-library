<template>
  <div :class="model.containerCss">
    <div v-if="model.isMobile" v-on:click="model.togglePopup" v-key2click>
      <sv-svg-icon :iconName="model.icon" :size="24"></sv-svg-icon>
      <sv-popup :model="model.popupModel"></sv-popup>
    </div>
    <sv-list v-else :model="model.listModel"></sv-list>
  </div>
</template>

<script lang="ts" setup>
import { type SurveyModel, TOCModel } from "survey-core";

const props = defineProps<{ survey: SurveyModel, model: TOCModel }>();
</script>
