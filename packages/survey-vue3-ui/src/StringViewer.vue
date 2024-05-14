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
  locString: LocalizableString;
}>();
const renderedHtml = useLocString(() => props.locString);
const className = props.locString.allowLineBreaks ? "sv-string-viewer sv-string-viewer--multiline" : "sv-string-viewer";
</script>
