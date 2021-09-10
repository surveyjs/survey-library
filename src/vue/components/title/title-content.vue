<template>
  <div>
    <survey-string v-if="!element.isTitleOwner" :locString="element.locTitle" />
    <div v-if="element.isTitleOwner"> 
    <span
      v-if="element.isRequireTextOnStart"
      :class="element.cssClasses.requiredText"
      :aria-hidden="true"
      >{{ element.requiredText }}</span
    >
    <span
      v-if="element.no"
      style="position: static"
      :class="element.cssClasses.number"
      :aria-hidden="true"
      >{{ element.no }}</span
    >
    <span
      v-if="element.isRequireTextBeforeTitle"
      :class="element.cssClasses.requiredText"
      :aria-hidden="true"
      >{{ element.requiredText }}</span
    >
    <survey-string :locString="element.locTitle" />
    <span
      v-if="element.isRequireTextAfterTitle"
      :class="element.cssClasses.requiredText"
      :aria-hidden="true"
      >{{ element.requiredText }}</span
    >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import { SurveyElementCore } from "survey-core";

@Component
export class TitleContent extends Vue {
  @Prop() element: SurveyElementCore;
  @Prop() css: any;
}
Vue.component("survey-element-title-content", TitleContent);
export default TitleContent;
</script>
