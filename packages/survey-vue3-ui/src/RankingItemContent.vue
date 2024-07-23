<template>
  <div :class="cssClasses.controlLabel">
    <SurveyVueComponent :name="'survey-string'" :locString="item.locText" />
  </div>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import type { ItemValue } from "survey-core";
defineOptions({ inheritAttrs: false });
defineProps<{
  item: ItemValue;
  cssClasses: any;
}>();
</script>
