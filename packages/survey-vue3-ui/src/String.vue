<template>
  <component :is="locString.renderAs" :locString="locString.renderAsData" />
</template>

<script lang="ts" setup>
import type { LocalizableString } from "survey-core";
defineProps<{
  locString: LocalizableString;
}>();
</script>
