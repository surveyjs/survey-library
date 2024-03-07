<template>
  <div :class="getItemClass(item)">
      <label :class="question.cssClasses.label">
        <input
          v-if="question.multiSelect"
          type="checkbox"
          :name="question.questionName"
          :value="item.value"
          :id="question.getItemId(item)"
          v-model="question.value"
          :disabled="!question.getItemEnabled(item)"
          v-bind:aria-required="question.ariaRequired"
          :aria-label="question.ariaLabel"
          :aria-invalid="question.ariaInvalid"
          :aria-errormessage="question.ariaErrormessage"
          :class="question.cssClasses.itemControl"
        />
        <input
          v-else
          type="radio"
          :name="question.questionName"
          :value="item.value"
          :id="question.getItemId(item)"
          v-model="question.value"
          :disabled="!question.getItemEnabled(item)"
          v-bind:aria-required="question.ariaRequired"
          :aria-label="question.ariaLabel"
          :aria-invalid="question.ariaInvalid"
          :aria-errormessage="question.ariaErrormessage"
          :class="question.cssClasses.itemControl"
        /><div :class="question.cssClasses.itemDecorator">
          <div :class="question.cssClasses.imageContainer">
            <span v-if="question.cssClasses.checkedItemDecorator" :class="this.question.cssClasses.checkedItemDecorator">
              <sv-svg-icon v-if="question.cssClasses.checkedItemSvgIconId" v-bind:class="question.cssClasses.checkedItemSvgIcon" size="auto" :iconName="question.cssClasses.checkedItemSvgIconId"></sv-svg-icon>
            </span>
            <img
              v-if="item.imageLink && !item.contentNotLoaded && question.contentMode === 'image'"
              :class="question.cssClasses.image"
              :src="item.imageLink"
              :width="question.renderedImageWidth"
              :height="question.renderedImageHeight"
              v-bind:style="{ objectFit: question.imageFit }"
              :alt="item.locText.renderedHtml"
              @load="(event) => { question.onContentLoaded(item, event) }"
              @error="(event) => { item.onErrorHandler() }"

            /><video controls
              v-if="item.imageLink && !item.contentNotLoaded && question.contentMode === 'video'"
              :class="question.cssClasses.image"
              :src="item.imageLink"
              :width="question.renderedImageWidth"
              :height="question.renderedImageHeight"
              v-bind:style="{ objectFit: question.imageFit }"
              @loadedmetadata="(event) => { question.onContentLoaded(item, event) }"
              @error="(event) => { item.onErrorHandler() }"
            ></video>
            <div
              v-if="!item.imageLink || item.contentNotLoaded"
              :class="question.cssClasses.itemNoImage"
              v-bind:style="{ width: question.renderedImageWidth + 'px', height: question.renderedImageHeight + 'px', objectFit: question.imageFit }"
            >
              <sv-svg-icon
                :class="question.cssClasses.itemNoImageSvgIcon"
                :iconName="question.cssClasses.itemNoImageSvgIconId"
                :size="48"></sv-svg-icon>
            </div>
          </div><span
            v-if="question.showLabel"
            :class="question.cssClasses.itemText"
            >
              <survey-string :locString="item.locText" />
            </span
          ></div>
      </label>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionImagePickerModel, ImageItemValue } from "survey-core";

@Component
export class ImagePickerItem extends QuestionVue<QuestionImagePickerModel> {
  @Prop() question: QuestionImagePickerModel;
  @Prop() item: ImageItemValue;
  getItemClass(item: any) {
    return this.question.getItemClass(item);
  }
  getModel() {
    return this.item;
  }
}
Vue.component("survey-imagepicker-item", ImagePickerItem);
export default ImagePickerItem;
</script>
