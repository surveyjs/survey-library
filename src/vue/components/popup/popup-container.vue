<template>
  <div ref="container">
    <div
      class="sv-popup"
      v-bind:class="model.styleClass"
      v-show="model.isVisible"
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

        <div
          class="sv-popup__content"
          data-bind="component: { name: contentComponentName, params: contentComponentData }"
        >
          <component
            :is="model.contentComponentName"
            v-bind="model.contentComponentData"
          ></component>
        </div>

        <div v-show="model.isModal" class="sv-popup__footer">
          <button v-on:click="model.cancel">
            {{ model.cancelButtonText }}
          </button>
          <button v-on:click="model.apply">{{ model.applyButtonText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { PopupBase } from "../../../popup";
import { BaseVue } from "../../base";

@Component
export class PopupContainer extends BaseVue {
  @Prop model: PopupBase;

  protected getModel() {
    return this.model;
  }

  clickInside(event: any) {
    event.stopPropagation();
  }

  onMounted() {
    this.model.container = <HTMLElement>this.$refs["container"];
  }
}
Vue.component("sv-popup-container", PopupContainer);
export default PopupContainer;
</script>
