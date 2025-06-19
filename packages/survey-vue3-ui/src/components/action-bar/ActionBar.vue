<template>
  <div
    v-if="model.hasVisibleActions"
    ref="root"
    :style="model.getRootStyle()"
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
import { onMounted, onUpdated, ref } from "vue";

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

useBase(() => props.model, undefined, (value) => {
  value.resetResponsivityManager();
});

const renderedActions = useComputedArray(() => {
  return props.model.renderedActions;
});
function initResponsivityManager() {
  if (!props.model.hasVisibleActions) return;
  props.model.initResponsivityManager(root.value);
} 
onUpdated(() => {
  initResponsivityManager();
})

onMounted(() => {
  initResponsivityManager();
});
</script>
