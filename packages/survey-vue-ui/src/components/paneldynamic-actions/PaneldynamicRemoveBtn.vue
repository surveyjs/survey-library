<template>
  <button
    type="button"
    :class="question.getPanelRemoveButtonCss()"
    @click="removePanelClick(panel)"
  >
    <span :class="question.cssClasses.buttonRemoveText">{{
      question.panelRemoveText
    }}</span>
    <span :class="question.cssClasses.iconRemove"></span>
  </button>
</template>

<script lang="ts">
import { PaneldynamicActionMixin } from "./action";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [PaneldynamicActionMixin],
  name: "sv-paneldynamic-remove-btn",
  data: (vm: any) => {
    return {
      removePanelClick(panel: any) {
        if (!vm.question.isInputReadOnly) {
          vm.question.removePanelUI(panel);
        }
      },
    };
  },
  computed: {
    // readonly
    panel(vm: any): any {
      return (vm.item && vm.item.data.panel) || vm.data.panel;
    },
  },
});
</script>
