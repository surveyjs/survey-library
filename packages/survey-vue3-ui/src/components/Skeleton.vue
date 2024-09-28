<template>
  <div class="sv-skeleton-element" :id="element.id" :style="{ height: element.skeletonHeight }"></div>
</template>

<script lang="ts" setup>
import { useBase } from "@/base";

const props = defineProps<{ element: any }>();

useBase(() => props.element);
</script>
