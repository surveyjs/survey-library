<template>
  <SvComponent
    :is="'survey-string'"
    v-if="element.isTitleRenderedAsString"
    :locString="element.locTitle"
  />
  <span
    v-if="!element.isTitleRenderedAsString && element.isRequireTextOnStart"
    :class="element.cssRequiredText"
    :aria-hidden="true"
    >{{ element.requiredText }}</span
  >
  <span
    v-if="!element.isTitleRenderedAsString && element.no"
    style="position: static"
    :class="element.cssTitleNumber"
    :aria-hidden="true"
    >{{ element.no }}</span
  >
  <span v-if="!element.isTitleRenderedAsString && element.no">&nbsp;</span>
  <span
    v-if="!element.isTitleRenderedAsString && element.isRequireTextBeforeTitle"
    :class="element.cssRequiredText"
    :aria-hidden="true"
    >{{ element.requiredText }}</span
  >
  <span
    v-if="!element.isTitleRenderedAsString && element.isRequireTextBeforeTitle"
    >&nbsp;</span
  >
  <SvComponent
    :is="'survey-string'"
    v-if="!element.isTitleRenderedAsString"
    :locString="element.locTitle"
  />
  <span
    v-if="!element.isTitleRenderedAsString && element.isRequireTextAfterTitle"
    >&nbsp;</span
  >
  <span
    v-if="!element.isTitleRenderedAsString && element.isRequireTextAfterTitle"
    :class="element.cssRequiredText"
    :aria-hidden="true"
    >{{ element.requiredText }}</span
  >
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { PanelModel, Question } from "survey-core";
import { computed } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{
  element: Question | PanelModel;
  css: any;
}>();

const cssClasses = computed(
  () =>
    (props.element.isPanel
      ? props.element.cssClasses.panel
      : props.element.cssClasses) || {}
);
</script>
