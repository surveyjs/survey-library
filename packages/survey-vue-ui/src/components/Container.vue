<template>
  <template v-if="components.length > 0">
    <div class="sv-components-column" v-if="needRenderWrapper">
      <template v-for="(component, index) in components">
        <component
          :is="component.component"
          :survey="survey"
          :model="component.data"
        ></component>
      </template>
    </div>
    <template v-else>
      <template v-for="(component, index) in components">
        <component
          :is="component.component"
          :survey="survey"
          :model="component.data"
        ></component>
      </template>
    </template>
  </template>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { SurveyModel } from "survey-core";

export default defineComponent({
  // eslint-disable-next-line
  name: "sv-components-container",
  props: {
    survey: { type: Object as PropType<SurveyModel>, required: true },
    container: String,
    needRenderWrapper: Boolean,
  },
  computed: {
    components(): Array<any> {
      return this.survey.getContainerContent(this.container as any);
    },
  },
});
</script>
