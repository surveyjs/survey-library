<template>
  <div ref="root">
    <SvComponent
      :is="'sv-popup-container'"
      :model="popupViewModel"
    ></SvComponent>
  </div>
</template>
<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import { PopupModel, createPopupViewModel } from "survey-core";
import { shallowRef, ref, onMounted, watch, onUnmounted } from "vue";
const props = defineProps<{
  model: PopupModel;
}>();
const popupViewModel = shallowRef();
const root = ref<HTMLElement>(null as any);

const setContainerElement = () => {
  const container = root.value;
  if (container) {
    popupViewModel.value.setComponentElement(container);
  }
};

watch(
  () => props.model,
  (newValue) => {
    if (popupViewModel.value) {
      popupViewModel.value.dispose();
    }
    popupViewModel.value = createPopupViewModel(newValue);
    setContainerElement();
  },
  { immediate: true }
);
useBase(() => popupViewModel.value);

onMounted(() => {
  setContainerElement();
});
onUnmounted(() => {
  popupViewModel.value.dispose();
});
</script>
