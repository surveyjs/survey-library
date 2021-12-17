<template>
   <div :class="question.cssClasses.footer" v-if="!!question.cssClasses.footer">
      <div :class="question.cssClasses.progress" v-if="question.isRangeShowing && question.isProgressBottomShowing">
        <div
          :class="question.cssClasses.progressBar"
          :style="{ width: progress }"
          role="progressbar"
        ></div>
      </div>
      <hr :class="question.cssClasses.separator"/>
      <div :class="question.cssClasses.footerButtonsContainer">
        <survey-paneldynamicadd :question="question" />
        <div v-if="!question.isRenderModeList" :class="question.cssClasses.progressContainer">
          <div :title="question.panelPrevText" @click="prevPanelClick">
            <sv-svg-icon :class="question.getPrevButtonCss()" :iconName="question.cssClasses.progressBtnIcon" :size="'auto'"></sv-svg-icon>
          </div>
          <div :class="question.cssClasses.progressText">{{ question.progressText }}</div>
          <div :title="question.panelNextText" @click="nextPanelClick">
            <sv-svg-icon :class="question.getNextButtonCss()" :iconName="question.cssClasses.progressBtnIcon" :size="'auto'"></sv-svg-icon>
          </div>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { PanelDynamicProgress } from "./paneldynamicprogress.vue";


@Component
export class PanelDynamicProgressV2 extends PanelDynamicProgress {
}

Vue.component("survey-paneldynamicprogress-v2", PanelDynamicProgressV2);
export default PanelDynamicProgressV2;
</script>
