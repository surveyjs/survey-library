<template>
  <div v-bind:class="item.getActionRootCss()" :id="item.id">
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
import { computed } from "vue";

const props = defineProps<{ item: Action }>();
const componentName = computed(
  () => props.item.component || "sv-action-bar-item"
);
useBase(() => props.item);
</script>
