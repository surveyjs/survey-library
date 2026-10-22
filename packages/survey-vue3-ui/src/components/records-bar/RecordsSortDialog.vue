<template>
  <div :class="model.rootCss">
    <SvComponent v-for="row in model.rows" :key="row.uniqueId" :is="'sv-action-bar'" :model="row"></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { RecordsSortDialogModel } from "survey-core";
import { useBase } from "@/base";

// The content of the "Sort by" dialog: one action bar per row (field, direction, remove).
const props = defineProps<{ model: RecordsSortDialogModel }>();
useBase(() => props.model);
</script>
