<template>
    <div :class="cssClasses.controlLabel">
      <survey-string :locString="text" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component
export class RankingItemContent extends Vue {
  @Prop() text: string;
  @Prop() cssClasses: any
}
Vue.component("survey-ranking-item-content", RankingItemContent);
export default RankingItemContent;
</script>