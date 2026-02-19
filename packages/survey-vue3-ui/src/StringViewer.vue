<template>
  <span
    :class="className"
    v-if="locString.hasHtml"
    v-html="renderedHtml"
  ></span>
  <span :class="className" v-else>{{ renderedHtml }}</span>
</template>

<script lang="ts" setup>
import type { LocalizableString } from "survey-core";
import { useLocString } from "./base";
const props = defineProps<{
  locString?: LocalizableString; //deprecated, use model instead
  model?: LocalizableString;
  textClass?: string;
}>();
const locString = props.model || props.locString;
const renderedHtml = useLocString(() => locString);
const className = locString.getStringViewerClassName(props.textClass);
</script>
