<template>
  <div class="sv-brand-info">
    <a class="sv-brand-info__logo" href="https://surveyjs.io/?utm_source=built-in_links&utm_medium=online_survey_tool&utm_campaign=landing_page"><img src="https://surveyjs.io/Content/Images/poweredby.svg"/></a>
    <div class="sv-brand-info__text">Try and see how easy it is to <a href="https://surveyjs.io/create-survey?utm_source=built-in_links&utm_medium=online_survey_tool&utm_campaign=create_survey">create a survey</a></div>
    <div class="sv-brand-info__terms"><a href="https://surveyjs.io/TermsOfUse">Terms of Use & Privacy Statement</a></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

@Component
export class BrandInfo extends Vue {
  constructor() {
    super();
  }
}

Vue.component("sv-brand-info", BrandInfo);

export default BrandInfo;
</script>
