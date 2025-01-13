<template>
  <div :class="page.css" :id="page.id">
    <sv-file-item
      v-for="(item, index) of page.items"
      :key="index"
      :item="item"
      :question="question"
    ></sv-file-item>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { QuestionFilePage, QuestionFileModel } from "survey-core";
@Component
export class FilePage extends Vue {
  @Prop() page: QuestionFilePage;
  @Prop() question: QuestionFileModel;
}
Vue.component("sv-file-page", FilePage);
export default FilePage;
</script>
