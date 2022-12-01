<template>
  <div class="sv-title-actions">
    <span class="sv-title-actions__title">
      <survey-string v-if="element.isPage" :locString="element.locTitle"></survey-string>
      <survey-element-title-content
        v-if="!element.isPage"
        :element="element"
        :css="css"
      ></survey-element-title-content>
    </span>
    <sv-action-bar :model="toolbar"></sv-action-bar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import {
  Action,
  AdaptiveActionContainer,
  Question,
  PanelModel,
  RendererFactory,
} from "survey-core";

@Component
export class TitleActions extends Vue {
  @Prop() element: Question | PanelModel;
  @Prop() css: any;
  constructor() {
    super();
  }

  public get toolbar(): AdaptiveActionContainer<Action> {
    return this.element.getTitleToolbar();
  }
}

RendererFactory.Instance.registerRenderer("element", "title-actions", "sv-title-actions");

Vue.component("sv-title-actions", TitleActions);
export default TitleActions;
</script>
