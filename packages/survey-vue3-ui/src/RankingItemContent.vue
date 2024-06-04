<template>
  <div :class="cssClasses.controlLabel">
    <survey-string :locString="item.locText" />
  </div>
</template>

<script lang="ts" setup>
import type { ItemValue } from "survey-core";
defineOptions({ inheritAttrs: false });
const props = defineProps<{
  item: ItemValue;
  cssClasses: any;
}>();
</script>
