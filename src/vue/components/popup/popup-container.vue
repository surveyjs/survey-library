<template>
  <div
    tabindex="-1"
    class="sv-popup"
    v-bind:class="model.styleClass"
    v-show="model.isVisible"
    v-on:keydown="
      (event) => {
        model.onKeyDown(event);
      }
    "
    v-on:click="
      (event) => {
        model.clickOutside(event);
      }
    "
  >
    <div
      class="sv-popup__container"
      v-bind:style="{
        left: model.left,
        top: model.top,
        height: model.height,
        width: model.width,
        minWidth: model.minWidth,
      }"
      v-on:click="clickInside"
    >
      <div class="sv-popup__shadow">
        <component
          v-if="model.showHeader"
          :is="model.popupHeaderTemplate"
          :model="model"
        ></component>
        <div class="sv-popup__body-content">
          <div class="sv-popup__body-header" v-if="!!model.title">{{ model.title }}</div>
          <div class="sv-popup__scrolling-content">
            <div class="sv-popup__content">
              <component
                :is="model.contentComponentName"
                v-bind="model.contentComponentData"
              ></component>
            </div>
          </div>
          <div v-if="model.showFooter" class="sv-popup__body-footer">
            <sv-action-bar :model="model.footerToolbar" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import {
  PopupBaseViewModel,
  createDialogOptions,
  createPopupModalViewModel,
  IDialogOptions,
  settings,
} from "survey-core";
import { BaseVue } from "../../base";

@Component
export class PopupContainer extends BaseVue {
  @Prop() model: PopupBaseViewModel;
  protected getModel() {
    return this.model;
  }
  clickInside(event: any) {
    event.stopPropagation();
  }
  onUpdated() {
    if (!this.model.isPositionSet && this.model.isVisible) {
      this.model.updateOnShowing();
    }
  }
}
// replace to showDialog then delete
export function showModal(
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
export function showDialog(dialogOptions: IDialogOptions, rootElement?: HTMLElement): PopupBaseViewModel {
  dialogOptions.onHide = () => {
    popup.$destroy();
    popupViewModel.container.remove();
    popupViewModel.dispose();
  };
  const popupViewModel: PopupBaseViewModel = createPopupModalViewModel(dialogOptions, rootElement);
  const popup = new PopupContainer({
    el: (<HTMLElement>popupViewModel.container).appendChild(document.createElement("div")),
    propsData: { model: popupViewModel },
  });
  popupViewModel.model.isVisible = true;
  return popupViewModel;
}
settings.showModal = showModal;
settings.showDialog = showDialog;
Vue.component("sv-popup-container", PopupContainer);
export default PopupContainer;
</script>
