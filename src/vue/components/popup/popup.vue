<template>
  <div><sv-popup-container :model="popupViewModel"></sv-popup-container></div>
</template>
<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { PopupBaseViewModel, PopupModel, PopupDropdownViewModel, createPopupViewModel, settings } from "survey-core";
import { PopupContainer } from "./popup-container.vue";
import { BaseVue } from "../../base";
@Component
export class Popup extends BaseVue {
  @Prop() model: PopupModel;
  @Prop() targetElement: HTMLElement;
  popupViewModel: PopupBaseViewModel;
  protected getModel() {
    return this.model;
  }
  constructor(props: any) {
    super(props);
    this.popupViewModel = createPopupViewModel(this.model, undefined as any);
  }
  onMounted() {
    this.popupViewModel.setComponentElement(this.$el as HTMLElement);
  }
  destroyed() {
    this.popupViewModel.dispose();
  }
}
Vue.component("sv-popup", Popup);
export default Popup;
</script>
