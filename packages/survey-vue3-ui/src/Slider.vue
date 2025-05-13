<template>
    <div :class="question.rootCss" ref="rootRef">
        <input v-if="question.sliderType !== 'single' && question.allowDragRange" ref="rangeInputRef"
        name="range-input" :class="question.cssClasses.input" type="range" tabIndex="-1" 
        :min="question.min" :max="question.max" :step="question.step" aria-hidden="true"
        @input="(e)=>{question.handleRangeOnChange(e as InputEvent)}"
        @pointerdown="(e)=>{question.handleRangePointerDown(e, rootRef as HTMLElement)}"
        @pointerup="(e)=>{question.handleRangePointerUp(e, rootRef as HTMLElement)}" />

        <div :class="question.cssClasses.visualContainer" @pointerup="(e)=>{question.setValueByClickOnPath(e, rootRef as HTMLElement)}">
          <div :class="question.cssClasses.visualContainerSlider">
            <div :class="question.cssClasses.inverseTrackLeft" :style="{ width: question.getTrackPercentLeft() + '%' }"></div>
            <div :class="question.cssClasses.inverseTrackRight" :style="{ width: question.getTrackPercentRight() + '%' }"></div>
            <div :class="question.cssClasses.rangeTrack" :style="{ left: question.getTrackPercentLeft() + '%', right: question.getTrackPercentRight() + '%' }" ></div>
            
            <template v-for="(value, i) in question.getRenderedValue()" :key="i">
              <input :class="question.cssClasses.input" :id="'sjs-slider-input-' + i" type="range" :value="value" 
                :min="question.min" :max="question.max" :step="question.step" :disabled="question.isDisabledAttr"
                @input="(e)=>{question.handleOnChange(e as InputEvent, i)}"
                @pointerdown="(e)=>{question.handlePointerDown(e)}"
                @pointerup="(e)=>{e.stopPropagation();question.handlePointerUp(e)}"
                @keydown="(e)=>{question.handleKeyDown(e)}"
                @keyup="(e)=>{question.handleKeyUp(e)}"
                @focus="()=>{question.handleOnFocus(i)}"
                @blur="()=>{question.handleOnBlur()}"
                :aria-required="question.a11y_input_ariaRequired"
                :aria-label="question.a11y_input_ariaLabel"
                :aria-labelledby="question.a11y_input_ariaLabelledBy"
                :aria-describedby="question.a11y_input_ariaDescribedBy"
                :aria-invalid="question.a11y_input_ariaInvalid"
                :aria-errormessage="question.a11y_input_ariaErrormessage"
              />
              <div :class="question.getThumbContainerCss(i)" :style="{ left: question.getPercent(value) + '%' }">
                <div v-if="question.tooltipVisibility !== 'never'" :class="question.tooltipCss">
                  <div :class="question.cssClasses.tooltipPanel">
                    <div :class="question.cssClasses.tooltipValue">
                      {{question.getTooltipValue(i)}}
                    </div>
                  </div>
                </div>
                <div :class="question.cssClasses.thumb">
                  <div :class="question.cssClasses.thumbDot"></div>
                </div>
              </div>

            </template>

          </div>
        </div>

        <div v-if="question.showLabels" :class="question.cssClasses.labelsContainer">
          <div>
            <div v-for="(value, i) in question.labelCount" :key="i" :class="question.getLabelCss(i)"
            :style="{ left: question.getLabelPosition(i) + '%' }"
            @pointerup="(e)=>{question.handleLabelPointerUp(e, i)}">
                <div :class="question.cssClasses.labelTick"></div>
                <div :class="question.cssClasses.labelText">
                  {{question.getLabelText(i)}}
                </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { QuestionSliderModel } from "survey-core";
import { useQuestion } from "./base";
import { onMounted, ref } from "vue";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{ question: QuestionSliderModel }>();
const rootRef = ref<HTMLElement | null>(null);
const rangeInputRef = ref<HTMLInputElement | null>(null)
useQuestion<QuestionSliderModel>(props, rootRef);

onMounted(() => {
  props.question.refreshInputRange(rangeInputRef.value);
});
</script>