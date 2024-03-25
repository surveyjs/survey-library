<template>
<div class="sd-rating-dropdown-item">
    <span class="sd-rating-dropdown-item_text">{{ item.title }}</span>
    <div v-if="!!item.description" class="sd-rating-dropdown-item_description">
      <survey-string :locString="item.description" />
    </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { BaseVue } from "../../base";

@Component
export class RatingItem extends BaseVue {
  @Prop() item: any;

  constructor() {
    super();
  }
  getModel() {
    return this.item;
  }
}

Vue.component("sv-rating-dropdown-item", RatingItem);
export default RatingItem;
</script>
