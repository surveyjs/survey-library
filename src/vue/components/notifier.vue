<template>
  <div v-bind:class="model.css" v-if="model.isDisplayed"
    :style="{ visibility: model.active ? 'visible' : 'hidden' }" role="alert" aria-live="polite">
    <span>{{ model.message }}</span>
    <sv-action-bar :model="model.actionBar"></sv-action-bar>
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
