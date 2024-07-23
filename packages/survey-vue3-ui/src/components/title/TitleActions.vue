<template>
  <div class="sv-title-actions">
    <span class="sv-title-actions__title">
      <SurveyVueComponent
        :name="'survey-string'"
        v-if="element.isPage"
        :locString="element.locTitle"
      ></SurveyVueComponent>
      <SurveyVueComponent
        :name="'survey-element-title-content'"
        v-if="!element.isPage"
        :element="element"
        :css="css"
      ></SurveyVueComponent>
    </span>
    <SurveyVueComponent :name="'sv-action-bar'" :model="toolbar"></SurveyVueComponent>
  </div>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import type { PanelModel, Question } from "survey-core";
import { computed } from "vue";

const props = defineProps<{
  element: Question | PanelModel;
  css: any;
}>();
const toolbar = computed(() => props.element.getTitleToolbar());
</script>
