<template>
  <SvComponent
    :name="'sv-svg-icon'"
    v-if="item.iconName"
    v-bind:class="model.cssClasses.itemIcon"
    :iconName="item.iconName"
    :size="item.iconSize"
  ></SvComponent>
  <SvComponent :name="'survey-string'" :locString="item.locTitle" />
  <SvComponent
    :name="'sv-svg-icon'"
    v-if="item.markerIconName"
    v-bind:class="item.cssClasses.itemMarkerIcon"
    :iconName="item.markerIconName"
    :size="item.markerIconSize"
  ></SvComponent>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import type { ListModel, Action } from "survey-core";

const props = defineProps<{ model: ListModel; item: Action }>();

useBase(() => props.item);
</script>
