<template>
  <div :class="model.coverClasses" :style="{ 'height': model.renderedHeight }">
    <div v-if="!!model.backgroundImage" :class="model.backgroundImageClasses" :style="model.backgroundImageStyle"></div>
    <div :class="model.contentClasses" :style="{ maxWidth: model.maxWidth }">
    <sv-cover-cell
      v-for="cell in model.cells"
      :model="cell"
    ></sv-cover-cell>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Base, SurveyModel, Cover, CoverCell } from "survey-core";
import { useBase } from "@/base";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  model: Cover;
  survey: SurveyModel;
}>();

useBase(() => {
  props.model.survey = props.survey
  return props.model;
});
</script>
