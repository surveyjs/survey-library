<template>
  <component :is="locString.renderAs" :locString="locString.renderAsData" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { LocalizableString } from "survey-core";

@Component
export class SurveyString extends Vue {
  @Prop() locString: LocalizableString;
}

Vue.component("survey-string", SurveyString);
export default SurveyString;
</script>
