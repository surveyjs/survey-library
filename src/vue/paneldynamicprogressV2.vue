<template>
   <div :class="question.cssClasses.footer">
      <div :class="question.cssClasses.progress" v-if="question.isRangeShowing && question.isProgressBottomShowing">
        <div
          :class="question.cssClasses.progressBar"
          :style="{ width: progress }"
          role="progressbar"
        ></div>
      </div>
      <hr :class="question.cssClasses.separatorV2"/>
      <div :class="question.cssClasses.footerButtonsContainer">
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
        <div v-if="!question.isRenderModeList" :class="question.cssClasses.progressContainer">
          <div :title="question.panelPrevText">
            <svg
              viewBox="0 0 16 16"
              :class="question.getPrevButtonCss()"
              @click="prevPanelClick"
            >
              <path :d="progressButtonSvgPath"></path>
            </svg>
          </div>
          <div :class="question.cssClasses.progressText">{{ question.progressText }}</div>
          <div :title="question.panelNextText">
            <svg
              viewBox="0 0 16 16"
              @click="nextPanelClick"
              :class="question.getNextButtonCss()"
            >
              <path :d="progressButtonSvgPath"/>
            </svg>
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
  get progressButtonSvgPath() {
    return "M15 8.99999H4.39998L8.69998 13.3L7.29998 14.7L0.599976 7.99999L7.29998 1.29999L8.69998 2.69999L4.39998 6.99999H15V8.99999Z";
  }
}

Vue.component("survey-paneldynamicprogress-v2", PanelDynamicProgressV2);
export default PanelDynamicProgressV2;
</script>
