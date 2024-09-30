<template>
  <template v-if="components.length > 0">
    <div
      v-if="needRenderWrapper"
      :class="['sv-components-column', 'sv-components-container-' + container]"
    >
      <template v-for="component in components" :key="component.id">
        <SvComponent
          :is="component.component"
          :survey="survey"
          :container="container"
          :model="component.data"
        ></SvComponent>
      </template>
    </div>
    <template v-else>
      <template v-for="component in components" :key="component.id">
        <SvComponent
          :is="component.component"
          :survey="survey"
          :container="container"
          :model="component.data"
        ></SvComponent>
      </template>
    </template>
  </template>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
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
