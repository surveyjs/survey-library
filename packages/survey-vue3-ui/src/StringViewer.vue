<template>
  <span
    class="sv-string-viewer"
    v-if="locString.hasHtml"
    v-html="renderedHtml"
  ></span>
  <span class="sv-string-viewer" v-else>{{ renderedHtml }}</span>
</template>

<script lang="ts" setup>
import type { LocalizableString } from "survey-core";
import { useLocString } from "./base";
const props = defineProps<{
  locString: LocalizableString;
}>();
const renderedHtml = useLocString(() => props.locString);
</script>
