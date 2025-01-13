<template>
  <div :class="survey.logoClassNames">
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
</template>
<script lang="ts" setup>
import type { SurveyModel } from "survey-core";
import { useLocString } from "./base";
import { computed } from "vue";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{ data: SurveyModel }>();
const survey = computed(() => props.data);
const logoUrl = useLocString(() => survey.value.locLogo);
</script>
