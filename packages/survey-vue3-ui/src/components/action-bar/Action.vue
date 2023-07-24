<template>
  <div v-bind:class="item.getActionRootCss()" :id="item.id">
    <div class="sv-action__content">
      <sv-action-bar-separator
        v-if="item.needSeparator"
      ></sv-action-bar-separator>
      <component :is="componentName" :item="item"> </component>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useBase } from "@/base";
import type { Action } from "survey-core";
import { computed } from "vue";

const props = defineProps<{ item: Action }>();
const componentName = computed(
  () => props.item.component || "sv-action-bar-item"
);
useBase(() => props.item);
</script>
