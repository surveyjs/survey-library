<template>
  <div class="sv-header--mobile">
    <div v-if="model.hasLogo" class="sv-header__logo">
    <div :class="model.logoClassNames">
      <img
        :class="model.css.logoImage"
        :src="model.locLogo.renderedHtml"
        :width="model.renderedLogoWidth"
        :height="model.renderedLogoHeight"
        :alt="model.locTitle.renderedHtml"
        :style="{ 'objectFit': model.logoFit, 'width': model.renderedStyleLogoWidth, 'height': model.renderedStyleLogoHeight }"
      />
    </div>
    </div>
    <div v-if="model.hasTitle" class="sv-header__title" :style="{ 'maxWidth': model['header'].textAreaWidth }">
      <survey-element-title :element="model.survey" :css="model.css" />
    </div>
    <div v-if="model.renderedHasDescription" class="sv-header__description" :style="{ 'maxWidth': model['header'].textAreaWidth }">
      <h5 v-if="model.renderedHasDescription" :class="model.css.description">
        <survey-string :locString="model.locDescription" />
      </h5>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Base, SurveyModel, Cover, CoverCell } from "survey-core";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  model: SurveyModel;
}>();
</script>
