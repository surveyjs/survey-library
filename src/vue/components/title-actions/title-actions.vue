<template>
  <div class="sv-title-actions">
    <span class="sv-title-actions__title">
      <survey-question-title-content
        :element="element"
        :css="css"
      ></survey-question-title-content>
    </span>
    <sv-action-bar class="sv-title-actions__bar" :items="items"></sv-action-bar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ISurveyElement } from "../../../base";
import { RendererFactory } from "../../../rendererFactory";

@Component
export class TitleActions extends Vue {
  @Prop element: ISurveyElement;
  @Prop css: any;
  constructor() {
    super();
  }

  public get items() {
    return this.element.getTitleActions();
  }
}

RendererFactory.Instance.registerRenderer(
  "element",
  "title-actions",
  "sv-title-actions"
);

Vue.component("sv-title-actions", TitleActions);
export default TitleActions;
</script>
