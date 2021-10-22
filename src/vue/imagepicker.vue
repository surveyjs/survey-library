<template>
  <fieldset :class="question.cssClasses.root">
    <legend
      role="radio"
      v-bind:aria-label="question.locTitle.renderedHtml"
    ></legend>
    <div
      v-for="(item, index) in question.visibleChoices"
      :key="item.value"
      :class="getItemClass(item)"
    >
      <label :class="question.cssClasses.label">
        <input
          v-if="question.multiSelect"
          style="display: none"
          type="checkbox"
          :name="question.name + '_' + question.id"
          :value="item.value"
          :id="question.inputId + '_' + item.value"
          v-model="question.value"
          :disabled="question.isInputReadOnly || !item.isEnabled"
          v-bind:aria-required="question.isRequired"
          :aria-label="question.ariaLabel"
          :aria-invalid="question.ariaInvalid"
          :aria-describedby="question.ariaDescribedBy"
          :class="question.cssClasses.itemControl"
        />
        <input
          v-else
          style="display: none"
          type="radio"
          :name="question.name + '_' + question.id"
          :value="item.value"
          :id="question.inputId + '_' + item.value"
          v-model="question.value"
          :disabled="question.isInputReadOnly || !item.isEnabled"
          v-bind:aria-required="question.isRequired"
          :aria-label="question.ariaLabel"
          :aria-invalid="question.ariaInvalid"
          :aria-describedby="question.ariaDescribedBy"
          :class="question.cssClasses.itemControl"
        />
        <div>
          <img
            v-if="question.contentMode === 'image'"
            :class="question.cssClasses.image"
            :src="item.imageLink"
            :width="
              question.imageWidth ? question.imageWidth + 'px' : undefined
            "
            :height="
              question.imageHeight ? question.imageHeight + 'px' : undefined
            "
            v-bind:style="{ objectFit: question.imageFit }"
            :alt="item.text || item.value"
          />
          <embed
            v-if="question.contentMode === 'video'"
            :class="question.cssClasses.image"
            :src="item.imageLink"
            :width="
              question.imageWidth ? question.imageWidth + 'px' : undefined
            "
            :height="
              question.imageHeight ? question.imageHeight + 'px' : undefined
            "
            v-bind:style="{ objectFit: question.imageFit }"
          />
          <span
            v-if="question.showLabel"
            :title="item.text || item.value"
            :class="question.cssClasses.itemText"
            >{{ item.text || item.value }}</span
          >
        </div>
      </label>
    </div>
  </fieldset>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionImagePickerModel } from "survey-core";

@Component
export class ImagePicker extends QuestionVue<QuestionImagePickerModel> {
  getItemClass(item: any) {
    return this.question.getItemClass(item);
  }
}
Vue.component("survey-imagepicker", ImagePicker);
export default ImagePicker;
</script>
