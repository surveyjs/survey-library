<template>
  <button tabindex="-1" class="sv-popup__close-button sd-action sd-action--icon" @click="model.clickClose()">
    <SvComponent class="sv-popup__close-button-icon" :is="'sv-svg-icon'" iconName="icon-close-24x24" size="auto"/>
  </button>
</template>
<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { PopupBaseViewModel } from "survey-core";

defineProps<{
  model: PopupBaseViewModel;
}>();
</script>
