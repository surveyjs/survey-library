<template>
  <div :class="tocModel.containerCss">
    <div v-if="tocModel.isMobile" v-on:click="tocModel.togglePopup" v-key2click>
      <sv-svg-icon :iconName="tocModel.icon" :size="24"></sv-svg-icon>
      <sv-popup :model="tocModel.popupModel"></sv-popup>
    </div>
    <sv-list v-else :model="tocModel.listModel"></sv-list>
  </div>
</template>

<script lang="ts">
import { SurveyModel, TOCModel } from "survey-core";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  props: {
    survey: { type: Object as PropType<SurveyModel>, required: true },
  },
  setup(props) {
    return {
      tocModel: new TOCModel(props.survey),
    };
  },
});
</script>
