<template>
  <div v-if="survey.renderedHasHeader" :class="survey.css.header">
    <div v-if="survey.isLogoBefore" :class="survey.logoClassNames">
      <img
        :class="survey.css.logoImage"
        :src="survey.locLogo.renderedHtml"
        :width="survey.logoWidth ? survey.logoWidth : undefined"
        :height="survey.logoHeight ? survey.logoHeight : undefined"
        :alt="survey.locTitle.renderedHtml"
        v-bind:style="{ objectFit: survey.logoFit }"
      />
    </div>

    <div
      v-if="survey.renderedHasTitle"
      :class="survey.css.headerText"
      v-bind:style="{ maxWidth: survey.titleMaxWidth }"
    >
      <survey-element-title :element="survey" :css="survey.css"/>
      <h5 :class="survey.css.description">
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
        v-bind:style="{ objectFit: survey.logoFit }"
      />
    </div>
    <div v-if="survey.isLogoAfter" class="sv-logo--right-tail"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { VueSurveyModel as SurveyModel } from "./surveyModel";

@Component
export class SurveyHeader extends Vue {
  @Prop() survey: SurveyModel;

  mounted() {
    var el = this.$el;
    if (el && this.survey) this.survey.doAfterRenderHeader(el);
  }
}

Vue.component("survey-header", SurveyHeader);
export default SurveyHeader;
</script>
