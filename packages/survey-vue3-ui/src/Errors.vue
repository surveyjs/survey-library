<template>
  <div
    v-if="element.hasVisibleErrors"
    :class="element.cssError"
    :id="element.id + '_errors'"
    ref="root"
  >
    <SvComponent
      v-for="(error, index) in element.errors"
      :is="element.survey['questionErrorComponent']"
      :element="element"
      :key="'error_' + index"
      :errorKey="'error_' + index"
      :error="error"
      :cssClasses="element.cssClasses"
    />
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { PanelModel, Question } from "survey-core";
import { ref } from "vue";

defineProps<{
  element: Question | PanelModel;
  location?: string;
}>();
const root = ref<HTMLElement>();
</script>
