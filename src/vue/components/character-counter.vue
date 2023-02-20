<template>
  <div :class="remainingCharacterCounter">{{ counter.remainingCharacterCounter }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { CharacterCounter } from "survey-core";
import { BaseVue } from "../base";

@Component
export class CharacterCounterComponent extends BaseVue {
  @Prop() counter: CharacterCounter;
  @Prop() remainingCharacterCounter: string;

  constructor() {
    super();
  }

  getModel() {
    return this.counter;
  }
}

Vue.component("sv-character-counter", CharacterCounterComponent);

export default CharacterCounterComponent;
</script>
