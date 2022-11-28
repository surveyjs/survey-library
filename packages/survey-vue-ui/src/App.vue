<script lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'

import { defineComponent } from "vue";
import { Model } from "survey-core";
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
    survey.description = "Survey description";
    survey.surveyId = "Survey1";
    return {
      survey: survey as any,
    };
  },
});

</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <Survey :model="survey" />
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
