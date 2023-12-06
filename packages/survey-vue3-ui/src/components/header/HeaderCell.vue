<template>
  <div :class="model.css" :style="model.style">
    <div class="sv-header__cell-content" :style="model.contentStyle">
      <div v-if="model.showLogo" class="sv-header__logo">
        <div :class="model.survey.logoClassNames">
          <img
            :class="model.survey.css.logoImage"
            :src="model.survey.locLogo.renderedHtml"
            :width="model.survey.renderedLogoWidth"
            :height="model.survey.renderedLogoHeight"
            :alt="model.survey.locTitle.renderedHtml"
            :style="{ 'objectFit': model.survey.logoFit as any, 'width': model.survey.renderedStyleLogoWidth, 'height': model.survey.renderedStyleLogoHeight }"
          />
        </div>
      </div>
      <div
        v-if="model.showTitle"
        class="sv-header__title"
        :style="{ maxWidth: model.textAreaWidth }"
      >
        <survey-element-title :element="model.survey" :css="model.survey.css" />
      </div>
      <div
        v-if="model.showDescription"
        class="sv-header__description"
        :style="{ maxWidth: model.textAreaWidth }"
      >
        <div
          v-if="model.survey.renderedHasDescription"
          :class="model.survey.css.description"
        >
          <survey-string :locString="model.survey.locDescription" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CoverCell } from "survey-core";
defineProps<{
  model: CoverCell;
}>();
</script>
