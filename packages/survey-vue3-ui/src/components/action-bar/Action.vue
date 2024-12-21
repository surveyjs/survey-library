<template>
  <div v-bind:class="item.getActionRootCss()" :id="item.id" ref="root">
    <div class="sv-action__content">
      <SvComponent
        :is="'sv-action-bar-separator'"
        v-if="item.needSeparator"
      ></SvComponent>
      <SvComponent :is="componentName" :item="item"> </SvComponent>
    </div>
  </div>
</template>
<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import type { Action } from "survey-core";
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
const root = ref();
const props = defineProps<{ item: Action }>();
const componentName = computed(
  () => props.item.component || "sv-action-bar-item"
);
useBase(() => props.item);
onMounted(() => {
  const item = props.item;
  item.updateModeCallback = (mode, callback) => {
    item.mode = mode;
    nextTick(() => {
      callback(mode, root.value);
    });
  };
});
onUnmounted(() => {
  const item = props.item;
  item.updateModeCallback = undefined as any;
});
</script>
