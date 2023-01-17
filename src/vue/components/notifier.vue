<template>
  <div v-show="model.active" v-bind:class="model.css">
    <span>{{ model.message }}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Notifier } from "survey-core";
import { BaseVue } from "../base";

@Component
export class NotifierComponent extends BaseVue {
  @Prop() model: Notifier;

  constructor() {
    super();
  }

  getModel() {
    return this.model;
  }
}

Vue.component("sv-notifier", NotifierComponent);

export default NotifierComponent;
</script>
