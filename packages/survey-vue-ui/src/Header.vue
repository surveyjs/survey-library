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
        v-bind:style="{ objectFit: survey.logoFit }"
      />
    </div>

    <div :class="survey.css.headerClose"></div>
  </div>
</template>

<script lang="ts">
import { SurveyModel } from "survey-core";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-header",
  props: {
    survey: Object as PropType<SurveyModel>,
  },
  mounted() {
    var el = this.$el;
    if (el && this.survey) this.survey.afterRenderHeader(el as any);
  },
});
</script>