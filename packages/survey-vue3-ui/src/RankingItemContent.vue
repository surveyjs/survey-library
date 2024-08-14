<template>
  <div :class="cssClasses.controlLabel">
    <SvComponent :name="'survey-string'" :locString="item.locText" />
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { ItemValue } from "survey-core";
defineOptions({ inheritAttrs: false });
defineProps<{
  item: ItemValue;
  cssClasses: any;
}>();
</script>
