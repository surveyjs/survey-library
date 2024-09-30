<template>
  <SvComponent :is="locString.renderAs" :locString="locString.renderAsData" />
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { LocalizableString } from "survey-core";
defineProps<{
  locString: LocalizableString;
}>();
</script>
