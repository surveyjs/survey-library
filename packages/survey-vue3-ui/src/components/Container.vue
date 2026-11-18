<template>
  <template v-if="groups.length > 0">
    <div
      v-if="needRenderWrapper"
      :class="['sv-components-column', 'sv-components-container-' + container]"
    >
      <template v-for="group in groups" :key="group.key">
        <div v-if="group.css" :class="group.css">
          <SvComponent
            v-for="component in group.elements"
            :key="component.id"
            :is="component.component"
            :survey="survey"
            :container="container"
            :model="component.data"
          ></SvComponent>
        </div>
        <SvComponent
          v-else
          :is="group.elements[0].component"
          :survey="survey"
          :container="container"
          :model="group.elements[0].data"
        ></SvComponent>
      </template>
    </div>
    <template v-else>
      <template v-for="group in groups" :key="group.key">
        <div v-if="group.css" :class="group.css">
          <SvComponent
            v-for="component in group.elements"
            :key="component.id"
            :is="component.component"
            :survey="survey"
            :container="container"
            :model="component.data"
          ></SvComponent>
        </div>
        <SvComponent
          v-else
          :is="group.elements[0].component"
          :survey="survey"
          :container="container"
          :model="group.elements[0].data"
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
const groups = computed(() =>
  props.survey.getContainerContentGroups(props.container as any)
);
</script>
