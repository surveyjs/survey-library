<template>
  <div :class="cssClasses.controlLabel">
    <survey-string :locString="text" />
  </div>
</template>

<script lang="ts" setup>
import type { LocalizableString } from "survey-core";
defineOptions({ inheritAttrs: false });
const props = defineProps<{
  text: LocalizableString;
  cssClasses: any;
}>();
</script>
