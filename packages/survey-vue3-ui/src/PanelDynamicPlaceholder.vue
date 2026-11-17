<template>
  <div
    :class="question.cssClasses.noEntriesPlaceholder"
  >
    <span :id="question.noEntriesTextId">
      <SvComponent
        :is="'survey-string'"
        :locString="question.locNoEntriesText"
      ></SvComponent>
    </span>
    <SvComponent v-if="question.getShowPlaceholderToolbar()" :is="'sv-action-bar'" :model="question.footerToolbar"></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionPanelDynamicModel } from "survey-core";

defineProps<{
  question: QuestionPanelDynamicModel;
}>();
</script> 