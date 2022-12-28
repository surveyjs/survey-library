<script lang="ts">
import HelloWorld from './components/HelloWorld.vue'

import { defineComponent } from "vue";
import { Model, StylesManager } from "survey-core";
import Survey from "./Survey.vue";

const json = {
 "logoPosition": "right",
 "pages": [
  {
   "name": "page1",
   "elements": [
    {
     "type": "text",
     "name": "question1"
    }
   ]
  }
 ]
};

StylesManager.applyTheme("defaultV2");

export default defineComponent({
  name: "App",
  components: {
    HelloWorld,
    Survey,
  },
  data() {
    const survey = new Model(json);
    survey.title = "It works!";
    survey.description = "This is the first survey in Vue3";
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
      <HelloWorld msg="We did it!" />
    </div>
  </header>

  <main>
    <survey :survey="survey" />
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
