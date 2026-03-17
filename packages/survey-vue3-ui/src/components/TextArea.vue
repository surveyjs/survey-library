<template>
  <div :class="cssClasses.root" @click="onContainerClick" :ref="(el)=>getRef(el as HTMLTextAreaElement)">
    <textarea
      ref="inputRef"
      :readonly="model.isReadOnlyAttr"
      :disabled="model.isDisabledAttr"
      :value="value"
      :id="model.id"
      :maxlength="model.maxLength"
      :cols="model.cols"
      :rows="model.rows"
      :placeholder="model.placeholder"
      :class="cssClasses.control"
      @blur="
        (e) => {
          model.onTextAreaBlur(e);
        }
      "
      @focus="
        (e) => {
          model.onTextAreaFocus(e);
        }
      "
      @change="
        (e) => {
          model.onTextAreaChange(e);
        }
      "
      @input="
        (e) => {
          model.onTextAreaInput(e);
        }
      "
      @keydown="
        (e) => {
          model.onTextAreaKeyDown(e);
        }
      "
      :aria-required="model.ariaRequired"
      :aria-label="model.ariaLabel"
      :aria-labelledby="model.ariaLabelledBy"
      :aria-describedby="model.ariaDescribedBy"
      :aria-invalid="model.ariaInvalid"
      :aria-errormessage="model.ariaErrormessage"
      :style="{ resize: 'none' }"
    ></textarea>
    <div v-if="model.characterCounter" :class="cssClasses.group">
      <SvComponent :is="'sv-character-counter'"
        :counter="model.characterCounter"
        :remainingCharacterCounter="cssClasses.characterCounter">
      </SvComponent>
    </div>
    <div v-if="model.question.resizeStyle !== 'none'" :class="cssClasses.grip" ref="anchorRef">
      <SvComponent :is="'sv-svg-icon'" :iconName="cssClasses.gripIconId" :size="'auto'"></SvComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { ResizeManager, type TextAreaModel } from "survey-core";
import { computed, onMounted, onUpdated, onUnmounted, ref } from "vue";

const props = defineProps<{ model: TextAreaModel, getRef?: (element: HTMLElement) => void }>();
const anchorRef = ref<HTMLDivElement>();
const inputRef = ref<HTMLTextAreaElement>();
const getRef = function (element: HTMLTextAreaElement) {
  if (props.getRef) props.getRef(element);
};
const value = computed(() => props.model.getTextValue() || "");
const cssClasses = computed(() => {
  return props.model.getCssClasses()
});
const onContainerClick = () => {
  inputRef.value?.focus();
} 
let resizeManager: ResizeManager;
onMounted(() => {
  if (anchorRef.value && inputRef.value && props.model.question.resizeStyle !== "none") {
      resizeManager = new ResizeManager(anchorRef.value, inputRef.value, props.model.question.resizeStyle);
  }
  if(inputRef.value) {
    props.model.setElement(inputRef.value);
  }
});
onUpdated(() => {
  if(inputRef.value) {
    props.model.setElement(inputRef.value);
  }
});
onUnmounted(() => {
  props.model.resetElement();
  resizeManager?.dispose();
});
</script>
