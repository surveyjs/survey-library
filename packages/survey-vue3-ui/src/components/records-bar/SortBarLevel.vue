<template>
  <SvComponent :is="'sv-action-bar'" :model="item.data"></SvComponent>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { Action } from "survey-core";
import { useBase } from "@/base";

// One level of the sort bar: an item of the bar that holds the level's own action bar (field, direction, remove).
const props = defineProps<{ item: Action }>();
useBase(() => props.item);
</script>
