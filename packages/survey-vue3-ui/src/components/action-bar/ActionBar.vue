<template>
  <div
    v-if="model.hasActions"
    ref="root"
    :class="model.getRootCss()"
    v-on:click="
      (event) => {
        event.stopPropagation();
      }
    "
  >
    <sv-action
      v-for="item in model.renderedActions"
      v-bind:key="item.id"
      :item="item"
    ></sv-action>
  </div>
</template>

<script lang="ts" setup>
import type { ActionContainer } from "survey-core";
import { useBase } from "@/base";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  model: ActionContainer;
  handleClick?: boolean;
}>();
const root = ref<HTMLDivElement>(null as any as HTMLDivElement);

useBase(() => props.model);

onMounted(() => {
  if (!props.model.hasActions) return;
  props.model.initResponsivityManager(root.value);
});
onUnmounted(() => {
  props.model.resetResponsivityManager();
});
</script>
