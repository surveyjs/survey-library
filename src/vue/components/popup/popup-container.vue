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
      () => {
        model.clickOutside();
      }
    "
  >
    <div
      class="sv-popup__container"
      v-bind:style="{ left: model.left, top: model.top }"
      v-on:click="clickInside"
    >
      <span
        v-show="model.showPointer"
        v-bind:style="{
          left: model.pointerTarget.left,
          top: model.pointerTarget.top,
        }"
        class="sv-popup__pointer"
      ></span>
      <div class="sv-popup__header"></div>
      <div class="sv-popup__scrolling-content">
        <div class="sv-popup__content">
          <component
            :is="model.contentComponentName"
            v-bind="model.contentComponentData"
          ></component>
        </div>
      </div>
      <div v-if="model.isModal" class="sv-popup__footer">
        <button
          v-on:click="
            () => {
              model.cancel();
            }
          "
          class="sv-popup__footer-item sv-popup__button sv-popup__button--cancel"
        >
          {{ model.cancelButtonText }}
        </button>
        <button
          v-on:click="
            () => {
              model.apply();
            }
          "
          class="sv-popup__footer-item sv-popup__button sv-popup__button--cancel"
        >
          {{ model.applyButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { PopupBaseViewModel, createPopupModalViewModel, settings } from "survey-core";
import { BaseVue } from "../../base";
@Component
export class PopupContainer extends BaseVue {
  @Prop() model: PopupBaseViewModel;
  private prevIsVisible: boolean;
  protected getModel() {
    return this.model;
  }
  clickInside(event: any) {
    event.stopPropagation();
  }
  onUpdated() {
    if (!this.prevIsVisible && this.model.isVisible) {
      this.model.updateOnShowing();
    }
    this.prevIsVisible = this.model.isVisible;
  }
}
export function showModal(
  componentName: string,
  data: any,
  onApply: () => boolean,
  onCancel?: () => void,
  cssClass?: string
) {
  const popupViewModel: PopupBaseViewModel = createPopupModalViewModel(
    componentName,
    data,
    onApply,
    onCancel,
    () => {
      popup.$destroy();
      popupViewModel.destroyPopupContainer();
    },
    undefined,
    cssClass
  );
  const popup = new PopupContainer({
    el: popupViewModel.container.appendChild(document.createElement("div")),
    propsData: { model: popupViewModel },
  });
  popupViewModel.model.isVisible = true;
}
settings.showModal = showModal;
Vue.component("sv-popup-container", PopupContainer);
export default PopupContainer;
</script>
