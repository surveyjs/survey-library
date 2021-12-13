<template>
  <fieldset :class="question.cssClasses.root">
    <legend
      role="radio"
      v-bind:aria-label="question.locTitle.renderedHtml"
    ></legend><div
      v-for="(item, index) in question.visibleChoices"
      :key="item.value"
      :class="getItemClass(item)"
    >
      <label :class="question.cssClasses.label">
        <input
          style="display: none"
          :type="question.inputType"
          :name="question.questionName"
          :value="item.value"
          :id="question.getItemId(item)"
          v-model="question.value"
          :disabled="!question.getItemEnabled(item)"
          v-bind:aria-required="question.ariaRequired"
          :aria-label="question.ariaLabel"
          :aria-invalid="question.ariaInvalid"
          :aria-describedby="question.ariaDescribedBy"
          :class="question.cssClasses.itemControl"
        /><div :class="question.cssClasses.itemDecorator">
          <div :class="question.cssClasses.imageContainer">
            <img
              v-if="question.contentMode === 'image'"
              :class="question.cssClasses.image"
              :src="item.imageLink"
              :width="question.renderedImageWidth"
              :height="question.renderedImageHeight"
              v-bind:style="{ objectFit: question.imageFit }"
              :alt="item.locText.renderedHtml"
            /><video controls
              v-if="question.contentMode === 'video'"
              :class="question.cssClasses.image"
              :src="item.imageLink"
              :width="question.renderedImageWidth"
              :height="question.renderedImageHeight"
              v-bind:style="{ objectFit: question.imageFit }"
            ></video>
          </div><span
            v-if="question.showLabel"
            :title="item.locText.renderedHtml"
            :class="question.cssClasses.itemText"
            >
              <survey-string :locString="item.locText" />
            </span
          ></div>
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
