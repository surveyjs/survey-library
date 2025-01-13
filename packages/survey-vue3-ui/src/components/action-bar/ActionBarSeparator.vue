<template>
  <div class="sv-action-bar-separator" :class="innerCss"></div>
</template>

<script lang="ts" setup>
import type { Action } from "survey-core";
import { computed } from "vue";

const props = defineProps<{ item?: Action }>();
const innerCss = computed(() => props.item && props.item.innerCss);
</script>
