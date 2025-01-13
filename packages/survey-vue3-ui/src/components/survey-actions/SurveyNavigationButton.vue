<template>
  <input
    v-if="item.visible"
    type="button"
    :disabled="item.disabled"
    :value="item.title"
    :class="item.innerCss"
    :title="item.getTooltip()"
    @mousedown="buttonMouseDown"
    @click="item.action"
  />
</template>

<script lang="ts" setup>
import { useBase } from "@/base";
import type { Action } from "survey-core";

const props = defineProps<{ item: Action }>();
const buttonMouseDown = () => {
  return props.item.data && props.item.data.mouseDown();
};

useBase(() => props.item);
</script>
