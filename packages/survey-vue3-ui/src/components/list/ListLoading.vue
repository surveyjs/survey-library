<template>
  <div :class="model.cssClasses.emptyContainer" role="status" :aria-label="model.getLocalizationString('loadingData')">
    <SvComponent :is="'sv-loading-indicator'" />
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import type { ListModel } from "survey-core";

defineOptions({ inheritAttrs: false });
const props = defineProps<{ model: ListModel }>();

useBase(() => props.model);
</script>
