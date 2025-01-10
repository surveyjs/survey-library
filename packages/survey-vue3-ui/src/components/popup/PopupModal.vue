<template>
  <Teleport v-if="popup" :to="popup.container"
    ><SvComponent :is="'sv-popup-container'" :model="popup"
  /></Teleport>
</template>
<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { onUnmounted, shallowRef } from "vue";
import {
  PopupBaseViewModel,
  createPopupModalViewModel,
  settings,
  type IDialogOptions,
} from "survey-core";

const popup = shallowRef<PopupBaseViewModel>();

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
if (!settings.showDialog) {
  settings.showDialog = showDialog;
  onUnmounted(() => {
    settings.showDialog = undefined as any;
  });
}
</script>
