<template>
  <div
    v-if="survey.headerView === 'advanced'"
    :class="model.headerClasses"
    :style="{ height: model.renderedHeight }"
  >
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
      <SvComponent
        :is="'sv-header-cell'"
        v-for="(cell, index) in model.cells"
        :model="cell"
        :key="index"
      ></SvComponent>
    </div>
    <div v-if="survey.isMobile">
      <SvComponent :is="'sv-header-mobile'" :model="model"></SvComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
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
