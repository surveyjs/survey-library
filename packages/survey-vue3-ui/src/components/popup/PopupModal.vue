<template>
  <Teleport v-if="popup" :to="popup.container"
    ><sv-popup-container :model="popup"></sv-popup-container
  ></Teleport>
</template>
<script lang="ts" setup>
import { onUnmounted, ref, shallowRef } from "vue";
import {
  PopupBaseViewModel,
  PopupModalViewModel,
  createDialogOptions,
  createPopupModalViewModel,
  settings,
  type IDialogOptions,
} from "survey-core";

const popup = shallowRef<PopupBaseViewModel>();
function showModal(
  componentName: string,
  data: any,
  onApply: () => boolean,
  onCancel?: () => void,
  cssClass?: string,
  title?: string,
  displayMode: "popup" | "overlay" = "popup"
): PopupBaseViewModel {
  const options = createDialogOptions(
    componentName,
    data,
    onApply,
    onCancel,
    undefined,
    undefined,
    cssClass,
    title,
    displayMode
  );
  return showDialog(options);
}
function showDialog(
  dialogOptions: IDialogOptions,
  rootElement?: HTMLElement
): PopupBaseViewModel {
  const popupViewModel: PopupBaseViewModel = createPopupModalViewModel(
    dialogOptions,
    rootElement
  );
  const onVisibilityChangedCallback = (
    _: PopupBaseViewModel,
    options: { isVisible: boolean }
  ) => {
    if (!options.isVisible) {
      popup.value = undefined;
      popupViewModel.dispose();
      popupViewModel.onVisibilityChanged.remove(onVisibilityChangedCallback);
    }
  };
  popupViewModel.onVisibilityChanged.add(onVisibilityChangedCallback);
  popupViewModel.model.isVisible = true;
  popup.value = popupViewModel;
  return popupViewModel;
}
if (!settings.showModal) {
  settings.showModal = showModal;
  onUnmounted(() => {
    settings.showModal = undefined as any;
  });
}
if (!settings.showDialog) {
  settings.showDialog = showDialog;
  onUnmounted(() => {
    settings.showDialog = undefined as any;
  });
}
</script>
