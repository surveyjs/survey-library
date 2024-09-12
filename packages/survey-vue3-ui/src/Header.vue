<template>
  <div v-if="survey.renderedHasHeader" :class="survey.css.header" ref="root">
    <SvComponent
      v-if="survey.isLogoBefore"
      :is="survey.getElementWrapperComponentName(survey, 'logo-image')"
      :data="survey.getElementWrapperComponentData(survey, 'logo-image')"
    ></SvComponent>

    <div
      v-if="survey.renderedHasTitle"
      :class="survey.css.headerText"
      v-bind:style="{ maxWidth: survey.titleMaxWidth }"
    >
      <SvComponent
        :is="'survey-element-title'"
        :element="survey"
        :css="survey.css"
      />
      <div v-if="survey.renderedHasDescription" :class="survey.css.description">
        <SvComponent :is="'survey-string'" :locString="survey.locDescription" />
      </div>
    </div>

    <SvComponent
      v-if="survey.isLogoAfter"
      :is="survey.getElementWrapperComponentName(survey, 'logo-image')"
      :data="survey.getElementWrapperComponentData(survey, 'logo-image')"
    ></SvComponent>

    <div :class="survey.css.headerClose"></div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { SurveyModel } from "survey-core";
import { onMounted, ref } from "vue";

const props = defineProps<{
  survey: SurveyModel;
}>();
const root = ref<HTMLElement>();

onMounted(() => {
  var el = root.value;
  if (el && props.survey) props.survey.afterRenderHeader(el as any);
});
</script>
