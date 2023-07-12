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
  methods: {
    removePanelClick(panel: any) {
      if (!this.question.isInputReadOnly) {
        this.question.removePanelUI(panel);
      }
    },
  },
  computed: {
    // readonly
    panel(): any {
      return (this.item && this.item.data.panel) || this.data.panel;
    },
  },
});
</script>
