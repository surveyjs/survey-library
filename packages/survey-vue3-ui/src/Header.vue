<template>
  <div v-if="survey.renderedHasHeader" :class="survey.css.header" ref="root">
    <SurveyVueComponent
      v-if="survey.isLogoBefore"
      :name="survey.getElementWrapperComponentName(survey, 'logo-image')"
      :data="survey.getElementWrapperComponentData(survey, 'logo-image')"
    ></SurveyVueComponent>

    <div
      v-if="survey.renderedHasTitle"
      :class="survey.css.headerText"
      v-bind:style="{ maxWidth: survey.titleMaxWidth }"
    >
      <SurveyVueComponent
        :name="'survey-element-title'"
        :element="survey"
        :css="survey.css"
      />
      <div v-if="survey.renderedHasDescription" :class="survey.css.description">
        <SurveyVueComponent
          :name="'survey-string'"
          :locString="survey.locDescription"
        />
      </div>
    </div>

    <SurveyVueComponent
      v-if="survey.isLogoAfter"
      :name="survey.getElementWrapperComponentName(survey, 'logo-image')"
      :data="survey.getElementWrapperComponentData(survey, 'logo-image')"
    ></SurveyVueComponent>

    <div :class="survey.css.headerClose"></div>
  </div>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
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
