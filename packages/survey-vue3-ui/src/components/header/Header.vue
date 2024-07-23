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
      <SurveyVueComponent
        :name="'sv-header-cell'"
        v-for="(cell, index) in model.cells"
        :model="cell"
        :key="index"
      ></SurveyVueComponent>
    </div>
    <div v-if="survey.isMobile">
      <SurveyVueComponent
        :name="'sv-header-mobile'"
        :model="model"
      ></SurveyVueComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
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
