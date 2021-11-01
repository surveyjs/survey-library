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
              viewBox="0 0 10 10"
              :class="question.getPrevButtonCss()"
              @click="prevPanelClick"
            >
              <polygon points="2,2 0,4 5,9 10,4 8,2 5,5 " />
            </svg>
          </div>
          <div :class="question.cssClasses.progressText">{{ question.progressText }}</div>
          <div :title="question.panelNextText">
            <svg
              viewBox="0 0 10 10"
              @click="nextPanelClick"
              :class="question.getNextButtonCss()"
            >
              <polygon points="2,2 0,4 5,9 10,4 8,2 5,5 " />
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
export class PanelDynamicProgressV2 extends PanelDynamicProgress {}

Vue.component("survey-paneldynamicprogress-v2", PanelDynamicProgressV2);
export default PanelDynamicProgressV2;
</script>
