<template>
  <div class="sv-header--mobile">
    <div v-if="model.survey.hasLogo" class="sv-header__logo">
      <div :class="model.survey.logoClassNames">
        <img
          :class="model.survey.css.logoImage"
          :src="model.survey.locLogo.renderedHtml"
          :width="model.survey.renderedLogoWidth"
          :height="model.survey.renderedLogoHeight"
          :alt="model.survey.locTitle.renderedHtml"
          :style="{ 'objectFit': model.survey.logoFit, 'width': model.survey.renderedStyleLogoWidth, 'height': model.survey.renderedStyleLogoHeight } as any"
        />
      </div>
    </div>
    <div
      v-if="model.survey.hasTitle"
      class="sv-header__title"
      :style="{ maxWidth: model.renderedtextAreaWidth }"
    >
      <SvComponent
        :is="'survey-element-title'"
        :element="model.survey"
        :css="model.survey.css"
      />
    </div>
    <div
      v-if="model.survey.renderedHasDescription"
      class="sv-header__description"
      :style="{ maxWidth: model.renderedtextAreaWidth }"
    >
      <div
        v-if="model.survey.renderedHasDescription"
        :class="model.survey.css.description"
      >
        <SvComponent
          :is="'survey-string'"
          :locString="model.survey.locDescription"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { Cover } from "survey-core";

defineProps<{
  model: Cover;
}>();
</script>
