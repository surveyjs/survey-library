<template>
  <Panel :element="element"></Panel>
</template>

<script lang="ts" setup>
import type { MaxdiffModel } from "survey-core";
import Panel from "./Panel.vue";
defineOptions({
  inheritAttrs: false,
});
defineProps<{ element: MaxdiffModel }>();
</script>
