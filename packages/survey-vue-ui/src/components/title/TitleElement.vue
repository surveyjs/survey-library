<template>
  <component
    v-if="element.hasTitle"
    v-bind:is="element.titleTagName"
    :class="element.cssTitle"
    v-bind:aria-label="element.titleAriaLabel"
    v-bind:id="element.ariaTitleId"
    v-bind:tabindex="element.titleTabIndex"
    v-bind:aria-expanded="element.titleAriaExpanded"
    v-bind:role="element.titleAriaRole"
    v-on:keyup="
      ($event) => {
        keyup($event);
      }
    "
  >
    <survey-element-title-content
      v-if="!element.hasTitleActions"
      :element="element"
      :css="css"
    ></survey-element-title-content>
    <sv-title-actions
      v-if="element.hasTitleActions"
      :element="element"
      :css="css"
    ></sv-title-actions>
  </component>
</template>

<script lang="ts">
import { SurveyElementCore, doKey2ClickUp } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-element-title",
  props: {
    element: Object as PropType<SurveyElementCore>,
    css: Object,
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.model; },
      keyup(evt: any) {
        doKey2ClickUp(evt);
      }
    }
  }
});

</script>
