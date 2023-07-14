<template>
  <button
    type="button"
    :class="question.getDetailPanelButtonCss(row)"
    @click="() => row.showHideDetailPanelClick()"
    v-bind:aria-expanded="
      question.getIsDetailPanelShowing(row) ? 'true' : 'false'
    "
    :aria-controls="
      question.getIsDetailPanelShowing(row) ? row.detailPanelId : null
    "
  >
  <sv-svg-icon
    :class="this.question.getDetailPanelIconCss(this.row)"
    :iconName="this.question.getDetailPanelIconId(this.row)"
    size="auto"
  >
  </sv-svg-icon>
  </button>
</template>

<script lang="ts">
import { BaseVue } from "../../../base";
import { Action, Base } from "survey-core";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [BaseVue],
  name: "sv-matrix-detail-button",
  props: {
    item: Object as PropType<Action>,
  },
  methods: {
    getModel(): Base {
      return this.item;
    },
  },
  computed: {
    // readonly
    question(): any {
      return this.item.data.question;
    },
    row() {
      return this.item.data.row;
    },
  },
});
</script>
