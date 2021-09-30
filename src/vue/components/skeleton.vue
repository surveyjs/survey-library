<template>
  <div class="sv-skeleton-element"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { BaseVue } from "../base";

@Component
export class Skeleton extends BaseVue {
  constructor() {
    super();
  }
}

Vue.component("sv-skeleton", Skeleton);

export default Skeleton;
</script>
