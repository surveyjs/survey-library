<template>
    <div :class="question.rootCss" ref="root">
        <input v-if="question.sliderType === 'single' && question.allowDragRange" ref="rangeInputRef"
        name="range-input" :class="question.cssClasses.input" type="range" tabIndex="-1" 
        :min="question.min" :max="question.max" :step="question.step"
        @change="(e)=>{question.handleRangeOnChange(e as InputEvent)}"
        @pointerdown="(e)=>{question.handleRangePointerDown(e, root as HTMLElement)}"
        @pointerup="(e)=>{question.handleRangePointerUp(e, root as HTMLElement)}" />

        <div :class="question.cssClasses.visualContainer" @pointerup="(e)=>{question.setValueByClickOnPath(e, root as HTMLElement)}">
          <div :class="question.cssClasses.visualContainerSlider">
            <div :class="question.cssClasses.inverseTrackLeft" :style="{ width: question.getTrackPercentLeft() + '%' }"></div>
            <div :class="question.cssClasses.inverseTrackRight" :style="{ width: question.getTrackPercentRight() + '%' }"></div>
            <div :class="question.cssClasses.rangeTrack" :style="{ left: question.getTrackPercentLeft() + '%', right: question.getTrackPercentRight() + '%' }" ></div>
            <template v-for="(value, i) in question.getRenderedValue()" :key="'thumb-' + i">
              <input :class="question.cssClasses.input" :id="'sjs-slider-input-' + i" type="range" :value="value" 
                :min="question.min" :max="question.max" :step="question.step" :disabled="question.isDisabledAttr"
                @change="(e)=>{question.handleOnChange(e as InputEvent, i)}"
                @pointerdown="(e)=>{question.handlePointerDown(e)}"
                @pointerup="(e)=>{question.handlePointerUp(e)}"
                @keydown="(e)=>{question.handleKeyDown(e)}"
                @keyup="(e)=>{question.handleKeyUp(e)}"
                @focus="()=>{question.handleOnFocus(i)}"
                @blur="()=>{question.handleOnBlur()}"
              />
            </template>
          </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { QuestionSliderModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{ question: QuestionSliderModel }>();
const root = ref<HTMLElement | null>(null);
useQuestion<QuestionSliderModel>(props, root);
</script>