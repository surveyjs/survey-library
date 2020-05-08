<template>
  <div
    v-if="
      (survey.locTitle.renderedHtml.length > 0 && survey.showTitle) ||
        survey.hasLogo
    "
    :class="survey.css.header"
  >
    <div v-if="survey.isLogoBefore" :class="survey.logoClassNames">
      <img
        :class="survey.css.logoImage"
        :src="survey.locLogo.renderedHtml"
        :width="survey.logoWidth ? survey.logoWidth + 'px' : undefined"
        :height="survey.logoHeight ? survey.logoHeight + 'px' : undefined"
        v-bind:style="{ objectFit: survey.logoFit }"
      />
    </div>

    <div
      v-if="survey.locTitle.renderedHtml.length > 0 && survey.showTitle"
      :class="survey.css.headerText"
    >
      <h3 :class="survey.css.title">
        <survey-string :locString="survey.locTitle" />
      </h3>
      <h5 :class="survey.css.description">
        <survey-string :locString="survey.locDescription" />
      </h5>
    </div>

    <div v-if="survey.isLogoAfter" :class="survey.logoClassNames">
      <img
        :class="survey.css.logoImage"
        :src="survey.locLogo.renderedHtml"
        :width="survey.logoWidth ? survey.logoWidth + 'px' : undefined"
        :height="survey.logoHeight ? survey.logoHeight + 'px' : undefined"
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
  @Prop
  @Prop
  survey: SurveyModel;

  mounted() {
    var el = this.$el;
    if (el && this.survey) this.survey.doAfterRenderHeader(el);
  }
}

Vue.component("survey-header", SurveyHeader);
export default SurveyHeader;
</script>
