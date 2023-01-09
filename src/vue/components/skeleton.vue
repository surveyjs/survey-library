<template>
  <div class="sv-skeleton-element" :id="element.id"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { SurveyElement, Question, PanelModel } from "survey-core";
import { BaseVue } from "../base";

@Component
export class Skeleton extends BaseVue {
  @Prop() element: Question | PanelModel;
  constructor() {
    super();
  }
}

Vue.component("sv-skeleton", Skeleton);

export default Skeleton;
</script>
