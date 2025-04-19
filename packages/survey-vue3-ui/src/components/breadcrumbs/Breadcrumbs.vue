<template>
  <div v-if="model.actions && model.actions.length" :class="css.breadcrumbsRoot">
    <template v-for="(item, itemIndex) in model.actions" :key="item.renderedId">
      <SvComponent
        v-if="itemIndex"
        :is="'sv-svg-icon'"
        :class="css.breadcrumbsSeparator"
        iconName="arrowright-16x16"
        size="auto"
      />
      <SvComponent :is="'sv-action'" :item="item" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { ActionContainer } from "survey-core";
import { useBase } from "./../../base";
defineOptions({ inheritAttrs: false });
const props = defineProps<{
  model: ActionContainer;
  css: any;
}>();
useBase(() => props.model);
</script>