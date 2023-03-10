<template>
  <div v-bind:class="item.getActionRootCss()" 
      :id="item.id">
    <div class="sv-action__content">
      <sv-action-bar-separator
        v-if="item.needSeparator"
      ></sv-action-bar-separator>
      <component :is="componentName" :item="item"> </component>
    </div>
  </div>
</template>
<script lang="ts">
import { Action } from "survey-core";
import { defineSurveyComponent } from "../../base";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "sv-action",
  props: {
    item: Action,
  },
  computed: {
    componentName() {
      return this.item.component || "sv-action-bar-item";
    },
  },
  data: (vm: any) => {
    return {
      getModel: () => {
        return vm.item;
      },
    };
  },
});

</script>
