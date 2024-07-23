<template>
  <SurveyVueComponent
    :name="'sv-list-item-content'"
    :item="item"
    :model="model"
  ></SurveyVueComponent>
  <SurveyVueComponent
    :name="'sv-popup'"
    :model="item.popupModel"
  ></SurveyVueComponent>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import { useBase } from "@/base";
import type { ListModel, Action } from "survey-core";

const props = defineProps<{ model: ListModel; item: Action }>();

useBase(() => props.item);
</script>
