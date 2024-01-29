<template>
  <template v-if="components.length > 0">
    <div class="sv-components-column" v-if="needRenderWrapper">
      <template v-for="(component, index) in components">
        <component
          :is="component.component"
          :survey="survey"
          :container="container"
          :model="component.data"
        ></component>
      </template>
    </div>
    <template v-else>
      <template v-for="(component, index) in components">
        <component
          :is="component.component"
          :survey="survey"
          :container="container"
          :model="component.data"
        ></component>
      </template>
    </template>
  </template>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { SurveyModel } from "survey-core";

const props = defineProps<{
  survey: SurveyModel;
  container: string;
  needRenderWrapper?: Boolean;
}>();
const components = computed(() =>
  props.survey.getContainerContent(props.container as any)
);
</script>
