<template>
  <div v-if="items && items.length" :class="css.breadcrumbsRoot">
    <template v-for="(item, itemIndex) in items" :key="item.renderedId">
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
import type { Action } from "survey-core";
defineOptions({ inheritAttrs: false });
defineProps<{
  items: Action[];
  css: any;
}>();
</script>