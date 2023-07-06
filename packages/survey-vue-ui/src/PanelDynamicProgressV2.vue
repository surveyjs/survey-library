<template>
  <div :class="question.cssClasses.footer" v-if="!!question.cssClasses.footer">
     <hr :class="question.cssClasses.separator"/>
     <div :class="question.cssClasses.progress" v-if="question.isRangeShowing && question.isProgressBottomShowing">
       <div
         :class="question.cssClasses.progressBar"
         :style="{ width: question.progress }"
         role="progressbar"
       ></div>
     </div>
     <div :class="question.cssClasses.footerButtonsContainer" v-if="question.footerToolbar.visibleActions.length">
         <sv-action-bar :model="question.footerToolbar"/>
     </div>
 </div>
</template>

<script lang="ts">
import { QuestionPanelDynamicModel } from "survey-core";
import { defineComponent } from "vue";
import PanelDynamicProgress from "./PanelDynamicProgress.vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-paneldynamicprogress-v2",
  props: {
    question: QuestionPanelDynamicModel,
  },
  mixins: [PanelDynamicProgress],
});
</script>
