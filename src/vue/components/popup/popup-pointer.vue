<template>
  <span
    class="sv-popup__pointer"
    v-bind:style="{
      left: model.pointerTarget.left,
      top: model.pointerTarget.top,
    }"
  ></span>
</template>
<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { PopupDropdownViewModel } from "survey-core";
import { BaseVue } from "../../base";

@Component
export class PopupPointer extends BaseVue {
  @Prop() model: PopupDropdownViewModel;
}
Vue.component("popup-pointer", PopupPointer);
export default PopupPointer;
</script>
