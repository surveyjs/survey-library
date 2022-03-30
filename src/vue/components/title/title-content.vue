<template>
  <fragment>
    <survey-string v-if="!element.isTitleOwner" :locString="element.locTitle" />
    <span
      v-if="element.isTitleOwner && element.isRequireTextOnStart"
      :class="element.cssClasses.requiredText"
      :aria-hidden="true"
      >{{ element.requiredText }}</span
    >
    <span
      v-if="element.isTitleOwner && element.no"
      style="position: static"
      :class="element.cssClasses.number"
      :aria-hidden="true"
      >{{ element.no }}</span
    >
    <span v-if="element.isTitleOwner && element.no">&nbsp;</span>
    <span
      v-if="element.isTitleOwner && element.isRequireTextBeforeTitle"
      :class="element.cssClasses.requiredText"
      :aria-hidden="true"
      >{{ element.requiredText }}</span
    >
    <span v-if="element.isTitleOwner && element.isRequireTextBeforeTitle">&nbsp;</span>
    <survey-string v-if="element.isTitleOwner" :locString="element.locTitle" />
    <span v-if="element.isTitleOwner && element.isRequireTextAfterTitle">&nbsp;</span>
    <span
      v-if="element.isTitleOwner && element.isRequireTextAfterTitle"
      :class="element.cssClasses.requiredText"
      :aria-hidden="true"
      >{{ element.requiredText }}</span
    >
  </fragment>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";

import Vue from "vue";
import { SurveyElementCore } from "survey-core";
import { Fragment } from 'vue-frag'
Vue.component('Fragment', Fragment)
@Component
export class TitleContent extends Vue {
  @Prop() element: SurveyElementCore;
  @Prop() css: any;
}
Vue.component("survey-element-title-content", TitleContent);
export default TitleContent;
</script>
