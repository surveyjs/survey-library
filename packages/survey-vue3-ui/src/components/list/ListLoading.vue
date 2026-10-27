<template>
  <div :class="model.cssClasses.emptyContainer">
    <div :class="model.cssClasses.emptyText" :aria-label="model.getLocalizationString('loadingData')">
      {{ model.getLocalizationString('loadingData') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBase } from "@/base";
import type { ListModel } from "survey-core";

defineOptions({ inheritAttrs: false });
const props = defineProps<{ model: ListModel }>();

useBase(() => props.model);
</script>
