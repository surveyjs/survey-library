<template>
  <SvComponent
    :is="'sv-list-item-content'"
    :item="item"
    :model="model"
  ></SvComponent>
  <SvComponent :is="'sv-popup'" :model="item.popupModel"></SvComponent>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import type { ListModel, Action } from "survey-core";

const props = defineProps<{ model: ListModel; item: Action }>();

useBase(() => props.item);
</script>
