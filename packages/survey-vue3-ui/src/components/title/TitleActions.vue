<template>
  <div class="sv-title-actions">
    <span class="sv-title-actions__title">
      <survey-string
        v-if="element.isPage"
        :locString="element.locTitle"
      ></survey-string>
      <survey-element-title-content
        v-if="!element.isPage"
        :element="element"
        :css="css"
      ></survey-element-title-content>
    </span>
    <sv-action-bar :model="toolbar"></sv-action-bar>
  </div>
</template>

<script lang="ts" setup>
import type { PanelModel, Question } from "survey-core";
import { computed } from "vue";

const props = defineProps<{
  element: Question | PanelModel;
  css: any;
}>();
const toolbar = computed(() => props.element.getTitleToolbar());
</script>
