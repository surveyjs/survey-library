<template>
  <div class="sv-action-bar-separator" :class="innerCss"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";

@Component
export class ActionBarSeparatorViewModel extends Vue {
  @Prop() item: any;

  public get innerCss(): string {
    return this.item && this.item.innerCss;
  }
}

Vue.component("sv-action-bar-separator", ActionBarSeparatorViewModel);
export default ActionBarSeparatorViewModel;
</script>
