<template>
  <div
    v-if="model.hasActions"
    ref="root"
    :class="model.getRootCss()"
    @click="onClick"
  >
    <SvComponent
      :is="'sv-action'"
      v-for="item in renderedActions"
      :key="item.renderedId"
      :item="item"
    ></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { ActionContainer } from "survey-core";
import { useBase, useComputedArray } from "@/base";
import { onMounted, onUnmounted, ref } from "vue";

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
