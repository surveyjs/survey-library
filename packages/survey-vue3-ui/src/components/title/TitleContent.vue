<template>
  <survey-string
    v-if="element.isTitleRenderedAsString"
    :locString="element.locTitle"
  />
  <span
    v-if="!element.isTitleRenderedAsString && element.isRequireTextOnStart"
    :class="cssClasses.requiredText"
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
    :class="cssClasses.requiredText"
    :aria-hidden="true"
    >{{ element.requiredText }}</span
  >
  <span
    v-if="!element.isTitleRenderedAsString && element.isRequireTextBeforeTitle"
    >&nbsp;</span
  >
  <survey-string
    v-if="!element.isTitleRenderedAsString"
    :locString="element.locTitle"
  />
  <span
    v-if="!element.isTitleRenderedAsString && element.isRequireTextAfterTitle"
    >&nbsp;</span
  >
  <span
    v-if="!element.isTitleRenderedAsString && element.isRequireTextAfterTitle"
    :class="cssClasses.requiredText"
    :aria-hidden="true"
    >{{ element.requiredText }}</span
  >
</template>

<script lang="ts" setup>
import type { PanelModel, Question } from "survey-core";
import { computed } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{
  element: Question | PanelModel;
  css: any;
}>();

const cssClasses = computed(() =>
  (props.element.isPanel
    ? props.element.cssClasses.panel
    : props.element.cssClasses) || {}
);
</script>
