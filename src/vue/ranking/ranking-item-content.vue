<template>
  <div :class="cssClasses.controlLabel">
    <survey-string :locString="item.locText" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ItemValue } from "survey-core";
@Component
export class RankingItemContent extends Vue {
  @Prop() item: ItemValue;
  @Prop() cssClasses: any
}
Vue.component("sv-ranking-item", RankingItemContent);
export default RankingItemContent;
</script>