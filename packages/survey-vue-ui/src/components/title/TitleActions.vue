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
import {
  Action,
  AdaptiveActionContainer,
  Question,
  PanelModel,
  RendererFactory,
} from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-element-title",
  props: {
    element: { type: Object, required: true },
    css: Object,
  },
  computed: {
    toolbar(): AdaptiveActionContainer<Action> {
      return this.element.getTitleToolbar();
    },
  },
});
RendererFactory.Instance.registerRenderer("element", "title-actions", "sv-title-actions");
</script>
