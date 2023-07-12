<template>
  <div class="survey">
    <h1>{{ model.title }}</h1>
    <h2>{{ model.description }}</h2>
    <div>{{ model.surveyId }}</div>
  </div>
</template>

<script lang="ts">
import { Model } from "survey-core";
import { defineComponent, type PropType } from "vue";
import { BaseVue } from "./base";

export default defineComponent({
  // eslint-disable-next-line
  name: "Survey",
  props: {
    model: Object as PropType<Model>,
  },
  mixins: [BaseVue],
  methods: {
    getModel() {
      return this.model;
    },
  },
});
</script>
