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
      v-bind:style="{
        left: model.left,
        top: model.top,
        height: model.height,
        width: model.width,
      }"
      v-on:click="clickInside"
    >
      <div class="sv-popup__shadow">
        <span
          class="sv-popup__pointer"
          v-show="model.showPointer"
          v-bind:style="{
            left: model.pointerTarget.left,
            top: model.pointerTarget.top,
          }"
        ></span>
        <div class="sv-popup__body-content">
          <div class="sv-popup__body-header" v-show="!!this.model.title">
            {{ this.model.title }}
          </div>
          <div class="sv-popup__scrolling-content">
            <div class="sv-popup__content">
              <component
                :is="model.contentComponentName"
                v-bind="model.contentComponentData"
              ></component>
            </div>
          </div>
          <div v-if="model.showFooter" class="sv-popup__body-footer">
            <button
              class="sv-popup__body-footer-item sv-popup__button sv-popup__button--cancel"
              type="button"
              v-on:click="
                () => {
                  model.cancel();
                }
              "
            >
              {{ model.cancelButtonText }}
            </button>
            <button
              class="sv-popup__body-footer-item sv-popup__button sv-popup__button--apply"
              v-if="model.isModal"
              type="button"
              v-on:click="
                () => {
                  model.apply();
                }
              "
            >
              {{ model.applyButtonText }}
            </button>
          </div>
        </div>
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
  cssClass?: string,
  title?: string
) {
  const popupViewModel: PopupBaseViewModel = createPopupModalViewModel(
    componentName,
    data,
    onApply,
    onCancel,
    () => {
      popup.$destroy();
      popupViewModel.dispose();
    },
    undefined,
    cssClass,
    title
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
