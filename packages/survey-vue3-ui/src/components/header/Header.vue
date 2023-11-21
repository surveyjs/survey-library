<template>
  <div :class="model.headerClasses" :style="{ height: model.renderedHeight }">
    <div
      v-if="!!model.backgroundImage"
      :class="model.backgroundImageClasses"
      :style="model.backgroundImageStyle"
    ></div>
    <div
      v-if="!survey.isMobile"
      :class="model.contentClasses"
      :style="{ maxWidth: model.maxWidth }"
    >
      <sv-header-cell
        v-for="(cell, index) in model.cells"
        :model="cell"
        :key="index"
      ></sv-header-cell>
    </div>
    <div v-if="survey.isMobile">
      <sv-header-mobile :model="model"></sv-header-mobile>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { SurveyModel, Cover } from "survey-core";
import { useBase } from "@/base";

const props = defineProps<{
  model: Cover;
  survey: SurveyModel;
}>();

useBase(() => {
  const model = props.model;
  model.survey = props.survey;
  return props.model;
});
</script>
