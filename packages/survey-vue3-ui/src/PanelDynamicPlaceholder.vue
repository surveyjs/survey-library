<template>
  <div
    :class="question.cssClasses.noEntriesPlaceholder"
  >
    <span>
      <SvComponent
        :is="'survey-string'"
        :locString="question.locNoEntriesText"
      ></SvComponent>
    </span>
    <SvComponent :is="'sv-action-bar'" :model="question.footerToolbar"></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionPanelDynamicModel } from "survey-core";

defineProps<{
  question: QuestionPanelDynamicModel;
}>();
</script> 