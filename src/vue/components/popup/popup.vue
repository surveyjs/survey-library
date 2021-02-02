<template>
  <div></div>
</template>
<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";

import { PopupBase, PopupModel } from "../../../popup";
import { PopupContainer } from "./popup-container.vue";

@Component
export class Popup extends Vue {
  private container: HTMLElement;
  @Prop model: PopupModel;
  @Prop targetElement: HTMLElement;

  mounted() {
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    const popup = new PopupBase(this.model, this.$el.parentElement);
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
