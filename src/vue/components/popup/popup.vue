<template>
  <div></div>
</template>
<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { PopupBaseViewModel, PopupModel, createPopupViewModel, settings } from "survey-core";
import { PopupContainer } from "./popup-container.vue";
import { BaseVue } from "../../base";
@Component
export class Popup extends BaseVue {
  @Prop() model: PopupModel;
  @Prop() targetElement: HTMLElement;
  private popupContainer: any;
  private popupViewModel: PopupBaseViewModel;
  protected getModel() {
    return this.model;
  }
  onMounted() {
    this.popupViewModel = createPopupViewModel(this.model, this.$el.parentElement, settings.environment);
    this.popupViewModel.initializePopupContainer();
    this.popupContainer = new PopupContainer({
      el: this.popupViewModel.container.appendChild(document.createElement("div")),
      propsData: { model: this.popupViewModel },
    });
  }
  destroyed() {
    this.popupContainer.$destroy();
    this.popupViewModel.dispose();
  }
}
Vue.component("sv-popup", Popup);
export default Popup;
</script>
