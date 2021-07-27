<template>
  <span
    class="sv-action"
    v-bind:class="{ 'sv-action--hidden': !item.isVisible }"
    v-show="item.visible || item.visible === undefined"
  >
    <sv-action-bar-separator
      v-if="item.needSeparator"
    ></sv-action-bar-separator>
    <component :is="getComponentName()" :item="item"> </component>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { Action, Base } from "survey-core";
import BaseVue from "../../base";
@Component
export class ActionViewModel extends BaseVue {
  @Prop() item: Action;
  constructor(props: any) {
    super(props);
  }
  getModel(): Base {
    return this.item;
  }
  getComponentName() {
    return this.item.component || "sv-action-bar-item";
  }
}
Vue.component("sv-action", ActionViewModel);
export default ActionViewModel;
</script>
