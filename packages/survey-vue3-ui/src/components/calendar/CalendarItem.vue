<template>
  <div :class="item.css" @click="calendar.selectItem(item)" @mouseenter="calendar.hoverItem(item)">{{ item.text }}</div>
</template>

<script lang="ts" setup>
import type { CalendarItem, CalendarViewModel } from "survey-core";
import { useBase } from "../../base";

const props = defineProps<{ item: CalendarItem, calendar: CalendarViewModel }>();
useBase(() => props.item);
</script>
