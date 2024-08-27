<template>
  <component :is="itemComponent" :item="item" :model="model">
  </component>
  <sv-popup :model="item.popupModel"></sv-popup>
</template>

<script lang="ts" setup>
import { useBase } from "@/base";
import type { ListModel, Action } from "survey-core";
import { computed } from "vue";

const props = defineProps<{ model: ListModel; item: Action }>();

const itemComponent = computed(
  () => props.item.component || props.model.itemComponent
);

useBase(() => props.item);
</script>
