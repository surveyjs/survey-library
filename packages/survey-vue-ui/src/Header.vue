<template>
  <div v-if="survey.renderedHasHeader" :class="survey.css.header">
    <div v-if="survey.isLogoBefore" :class="survey.logoClassNames">
      <img
        :class="survey.css.logoImage"
        :src="survey.locLogo.renderedHtml"
        :width="survey.logoWidth ? survey.logoWidth : undefined"
        :height="survey.logoHeight ? survey.logoHeight : undefined"
        :alt="survey.locTitle.renderedHtml"
        v-bind:style="{ objectFit: survey.logoFit as any }"
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
        :src="survey.locLogo.renderedHtml"
        :width="survey.logoWidth ? survey.logoWidth : undefined"
        :height="survey.logoHeight ? survey.logoHeight : undefined"
        :alt="survey.locTitle.renderedHtml"
        v-bind:style="{ objectFit: survey.logoFit as any }"
      />
    </div>

    <div :class="survey.css.headerClose"></div>
  </div>
</template>

<script lang="ts" setup>
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
