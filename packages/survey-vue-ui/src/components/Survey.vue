<template>
  <div class="survey">
    <h1>{{ model.title }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Model } from "survey-core";

export default defineComponent({
  // eslint-disable-next-line
  name: "Survey",
  props: {
    model: Model,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
