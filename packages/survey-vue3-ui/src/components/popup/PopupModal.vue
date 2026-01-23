<template>
  <Teleport v-for="model in models" :model="model" :key="model.uniqueId" :to="model.container">
    <SvComponent :is="'sv-popup-container'" :model="model"/>
  </Teleport>
</template>
<script lang="ts" setup>
import { onUnmounted, shallowRef } from "vue";
import {
  PopupBaseViewModel,
  createPopupModalViewModel,
  settings,
  type IDialogOptions,
} from "survey-core";
import SvComponent from "@/SvComponent.vue";

const models = shallowRef<Array<PopupBaseViewModel>>([]);

function showDialog(
  dialogOptions: IDialogOptions,
  rootElement?: HTMLElement
): PopupBaseViewModel {
  const model: PopupBaseViewModel = createPopupModalViewModel(
    dialogOptions,
    rootElement
  );
  const onVisibilityChangedCallback = (
    _: PopupBaseViewModel,
    options: { isVisible: boolean }
  ) => {
    if (!options.isVisible) {
      const index = models.value.indexOf(model);
      if(index >= 0) {
        models.value.splice(index, 1);
        models.value = models.value.slice();
      }
      model.onVisibilityChanged.remove(onVisibilityChangedCallback);
      model.dispose();
    }
  };
  model.onVisibilityChanged.add(onVisibilityChangedCallback);
  model.model.isVisible = true;
  models.value = models.value.concat(model);
  return model;
}
if (!settings.showDialog) {
  settings.showDialog = showDialog;
  onUnmounted(() => {
    settings.showDialog = undefined as any;
    for(const model of models.value) {
      model.dispose();
    }
    models.value = [];
  });
}
</script>
