<template>
  <div v-if="survey.renderedHasHeader" :class="survey.css.header">
    <div v-if="survey.isLogoBefore" :class="survey.logoClassNames">
      <img
        :class="survey.css.logoImage"
        :src="survey.locLogo.renderedHtml"
        :width="survey.renderedLogoWidth"
        :height="survey.renderedLogoHeight"
        :alt="survey.locTitle.renderedHtml"
        v-bind:style="{ objectFit: survey.logoFit, width: survey.renderedStyleLogoWidth, height: survey.renderedStyleLogoHeight }"
      />
    </div>

    <div
      v-if="survey.renderedHasTitle"
      :class="survey.css.headerText"
      v-bind:style="{ maxWidth: survey.titleMaxWidth }"
    >
      <survey-element-title :element="survey" :css="survey.css" />
      <div v-if="survey.renderedHasDescription" :class="survey.css.description">
        <survey-string :locString="survey.locDescription" />
      </div>
    </div>

    <div v-if="survey.isLogoAfter" :class="survey.logoClassNames">
      <img
        :class="survey.css.logoImage"
        :src="survey.locLogo.renderedHtml"
        :width="survey.renderedLogoWidth"
        :height="survey.renderedLogoHeight"
        :alt="survey.locTitle.renderedHtml"
        v-bind:style="{ objectFit: survey.logoFit, width: survey.renderedStyleLogoWidth, height: survey.renderedStyleLogoHeight }"
      />
    </div>

    <div :class="survey.css.headerClose"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel } from "survey-core";

@Component
export class SurveyHeader extends Vue {
  @Prop() survey: SurveyModel;

  mounted() {
    var el = this.$el;
    if (el && this.survey) this.survey.afterRenderHeader(<any>el);
  }
}

Vue.component("survey-header", SurveyHeader);
export default SurveyHeader;
</script>
