<template>
  <div v-if="survey.renderedHasHeader" :class="survey.css.header" ref="root">
    <div v-if="survey.isLogoBefore" :class="survey.logoClassNames">
      <img
        :class="survey.css.logoImage"
        :src="logoUrl"
        :width="survey.renderedLogoWidth"
        :height="survey.renderedLogoHeight"
        :alt="survey.locTitle.renderedHtml"
        :style="{
          objectFit: survey.logoFit as any,
          width: survey.renderedStyleLogoWidth,
          height: survey.renderedStyleLogoHeight,
        }"
      />
    </div>

    <div
      v-if="survey.renderedHasTitle"
      :class="survey.css.headerText"
      v-bind:style="{ maxWidth: survey.titleMaxWidth }"
    >
      <survey-element-title :element="survey" :css="survey.css" />
      <h5 v-if="survey.renderedHasDescription" :class="survey.css.description">
        <survey-string :locString="survey.locDescription" />
      </h5>
    </div>

    <div v-if="survey.isLogoAfter" :class="survey.logoClassNames">
      <img
        :class="survey.css.logoImage"
        :src="logoUrl"
        :width="survey.renderedLogoWidth"
        :height="survey.renderedLogoHeight"
        :alt="survey.locTitle.renderedHtml"
        :style="{
          objectFit: survey.logoFit as any,
          width: survey.renderedStyleLogoWidth,
          height: survey.renderedStyleLogoHeight,
        }"
      />
    </div>

    <div :class="survey.css.headerClose"></div>
  </div>
</template>

<script lang="ts" setup>
import type { SurveyModel } from "survey-core";
import { onMounted, ref } from "vue";
import { useLocString } from "./base";

const props = defineProps<{
  survey: SurveyModel;
}>();
const root = ref<HTMLElement>();

const logoUrl = useLocString(() => props.survey.locLogo);

onMounted(() => {
  var el = root.value;
  if (el && props.survey) props.survey.afterRenderHeader(el as any);
});
</script>
