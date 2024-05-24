<template>
  <sv-list-item-content :item="item" :model="model"></sv-list-item-content>
  <sv-popup :model="item.popupModel"></sv-popup>
</template>

<script lang="ts" setup>
import { useBase } from "@/base";
import type { ListModel, Action } from "survey-core";

const props = defineProps<{ model: ListModel; item: Action }>();

useBase(() => props.item);
</script>
