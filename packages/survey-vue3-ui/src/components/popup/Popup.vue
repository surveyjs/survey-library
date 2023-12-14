<template>
  <div ref="root">
    <sv-popup-container :model="popupViewModel"></sv-popup-container>
  </div>
</template>
<script lang="ts" setup>
import { useBase } from "@/base";
import { PopupModel, createPopupViewModel } from "survey-core";
import { shallowRef, ref, onMounted, watch, onUnmounted } from "vue";
const props = defineProps<{
  getTarget?: (el: HTMLElement) => HTMLElement;
  model: PopupModel;
}>();
const popupViewModel = shallowRef();
const root = ref<HTMLElement>(null as any);

watch(
  () => props.model,
  (newValue) => {
    if (popupViewModel.value) {
      popupViewModel.value.dispose();
    }
    popupViewModel.value = createPopupViewModel(newValue, undefined as any);
  },
  { immediate: true }
);
useBase(() => popupViewModel.value);

onMounted(() => {
  const container = root.value;
  popupViewModel.value.setComponentElement(
    container,
    props.getTarget ? props.getTarget(container) : undefined
  );
});
onUnmounted(() => {
  popupViewModel.value.dispose();
});
</script>
