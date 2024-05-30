<template>
  <sv-svg-icon
    v-if="item.iconName"
    v-bind:class="model.cssClasses.itemIcon"
    :iconName="item.iconName"
    :size="item.iconSize"
  ></sv-svg-icon>
  <survey-string :locString="item.locTitle" />
  <sv-svg-icon
    v-if="item.markerIconName"
    v-bind:class="item.cssClasses.itemMarkerIcon"
    :iconName="item.markerIconName"
    :size="item.markerIconSize"
  ></sv-svg-icon>
</template>

<script lang="ts" setup>
import { useBase } from "@/base";
import type { ListModel, Action, IAction } from "survey-core";

const props = defineProps<{ model: ListModel; item: Action }>();

useBase(() => props.item);
</script>
