<template>
  <div
    v-if="question.getShowNoEntriesPlaceholder()"
    :class="question.cssClasses.noEntriesPlaceholder"
  >
    <span>
      <SvComponent
        :is="'survey-string'"
        :locString="question.locNoEntriesText"
      ></SvComponent>
    </span>
    <SvComponent :is="'sv-paneldynamic-add-btn'" :data="{ question }" />
  </div>
  <div v-else>
    aaaa
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionPanelDynamicModel } from "survey-core";

defineProps<{
  question: QuestionPanelDynamicModel;
}>();
</script> 