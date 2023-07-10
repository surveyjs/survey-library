<template>
  <div v-if="components.length > 0" class="sv-components-column">
    <template v-for="(component, index) in components">
      <component 
        :is="component.component"
        :survey="survey"
        :model="component.data"
      ></component>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { SurveyModel, Action } from "survey-core";

export default defineComponent({
  // eslint-disable-next-line
  name: "sv-components-container",
  props: {
    survey: Object as PropType<SurveyModel>,
    container: String,
  },
  computed: {
    components(): Array<any> {
      return this.survey.getContainerContent(this.container as any);
    },
  },
});
</script>
