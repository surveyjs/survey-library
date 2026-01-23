<template>
  <Teleport v-for="modal in modals" :model="modal" :key="modal.uniqueId" :to="modal.container">
    <SvComponent :is="'sv-popup-container'" :model="modal"/>
  </Teleport>
</template>
<script lang="ts" setup>
import { computed, onUnmounted, triggerRef } from "vue";
import {
  PopupModalManager,
  settings,
  type IDialogOptions,
} from "survey-core";
import SvComponent from "@/SvComponent.vue";
const modalManager = new PopupModalManager();
const modals = computed(() => modalManager.getModals());
modalManager.onModalsChangedCallback = () => { triggerRef(modals); };
if (!settings.showDialog) {
  settings.showDialog = (dialogOptions: IDialogOptions, rootElement?: HTMLElement) => modalManager.addDialog(dialogOptions, rootElement);
  onUnmounted(() => {
    settings.showDialog = undefined as any;
    modalManager.clear();
  });
}
</script>
