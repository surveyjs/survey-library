<template>
  <div></div>
</template>
<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";

import { PopupViewModel, PopupModel } from "survey-core";
import { PopupContainer } from "./popup-container.vue";
import { BaseVue } from "../../base";

@Component
export class Popup extends BaseVue {
  private container: HTMLElement;
  @Prop model: PopupModel;
  @Prop targetElement: HTMLElement;

  protected getModel() {
    return this.model;
  }

  onMounted() {
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    const popup = new PopupViewModel(this.model, this.$el.parentElement);
    new PopupContainer({
      el: this.container,
      propsData: { model: popup },
    });
  }

  beforeDestroy() {
    this.container.remove();
    this.container = undefined;
  }
}

Vue.component("sv-popup", Popup);
export default Popup;
</script>
