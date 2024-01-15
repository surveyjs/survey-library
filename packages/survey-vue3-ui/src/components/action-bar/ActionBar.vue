<template>
  <div
    v-if="model.hasActions"
    ref="root"
    :class="model.getRootCss()"
    @click="onClick"
  >
    <sv-action
      v-for="item in renderedActions"
      v-bind:key="item.id"
      :item="item"
    ></sv-action>
  </div>
</template>

<script lang="ts" setup>
import type { ActionContainer } from "survey-core";
import { useBase, useComputedArray } from "@/base";
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    model: ActionContainer;
    container?: string;
    handleClick?: boolean;
  }>(),
  {
    handleClick: true,
  }
);
const root = ref<HTMLDivElement>(null as any as HTMLDivElement);

const onClick = (event: MouseEvent) => {
  if (props.handleClick) {
    event.stopPropagation();
  }
};

useBase(() => props.model);

const renderedActions = useComputedArray(() => {
  return props.model.renderedActions;
});

onMounted(() => {
  if (!props.model.hasActions) return;
  props.model.initResponsivityManager(root.value);
});
onUnmounted(() => {
  props.model.resetResponsivityManager();
});
</script>
