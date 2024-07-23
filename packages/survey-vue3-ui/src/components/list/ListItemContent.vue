<template>
  <SurveyVueComponent
    :name="'sv-svg-icon'"
    v-if="item.iconName"
    v-bind:class="model.cssClasses.itemIcon"
    :iconName="item.iconName"
    :size="item.iconSize"
  ></SurveyVueComponent>
  <SurveyVueComponent :name="'survey-string'" :locString="item.locTitle" />
  <SurveyVueComponent
    :name="'sv-svg-icon'"
    v-if="item.markerIconName"
    v-bind:class="item.cssClasses.itemMarkerIcon"
    :iconName="item.markerIconName"
    :size="item.markerIconSize"
  ></SurveyVueComponent>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import { useBase } from "@/base";
import type { ListModel, Action } from "survey-core";

const props = defineProps<{ model: ListModel; item: Action }>();

useBase(() => props.item);
</script>
