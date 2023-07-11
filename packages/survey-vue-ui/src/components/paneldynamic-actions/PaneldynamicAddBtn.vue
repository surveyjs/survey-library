<template>
  <button
    type="button"
    v-if="question.canAddPanel"
    :class="question.getAddButtonCss()"
    @click="addPanelClick"
  >
    <span :class="question.cssClasses.buttonAddText">
      {{ question.panelAddText }}
    </span>
  </button>
</template>

<script lang="ts">
import { PaneldynamicActionMixin } from "./action";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [PaneldynamicActionMixin],
  name: "sv-paneldynamic-add-btn",
  methods: {
    addPanelClick() {
      this.question.addPanelUI();
    },
  },
});
</script>
