<template>
  <span
    :class="className"
    v-if="model.hasHtml"
    v-html="renderedHtml"
  ></span>
  <span :class="className" v-else>{{ renderedHtml }}</span>
</template>

<script lang="ts" setup>
import type { LocalizableString } from "survey-core";
import { useLocString } from "./base";
const props = defineProps<{
  model: LocalizableString;
  textClass?: string;
}>();
const renderedHtml = useLocString(() => props.model);
const className = props.model.getStringViewerClassName(props.textClass);
</script>
