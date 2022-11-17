<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <Survey :model="survey" />
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Model } from "survey-core";
import HelloWorld from "./components/HelloWorld.vue";
import Survey from "./components/Survey.vue";

export default defineComponent({
  name: "App",
  components: {
    HelloWorld,
    Survey,
  },
  data() {
    const survey = new Model({});
    survey.title = "It works!";
    return {
      survey: survey,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
