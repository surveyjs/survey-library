<template>
  <div class="sv-title-actions">
    <span class="sv-title-actions__title">
      <SvComponent
        :name="'survey-string'"
        v-if="element.isPage"
        :locString="element.locTitle"
      ></SvComponent>
      <SvComponent
        :name="'survey-element-title-content'"
        v-if="!element.isPage"
        :element="element"
        :css="css"
      ></SvComponent>
    </span>
    <SvComponent :name="'sv-action-bar'" :model="toolbar"></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { PanelModel, Question } from "survey-core";
import { computed } from "vue";

const props = defineProps<{
  element: Question | PanelModel;
  css: any;
}>();
const toolbar = computed(() => props.element.getTitleToolbar());
</script>
