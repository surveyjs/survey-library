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
          :aria-describedby="question.ariaDescribedBy"
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
          :aria-describedby="question.ariaDescribedBy"
          :class="question.cssClasses.itemControl"
        /><div :class="question.cssClasses.itemDecorator">
          <div :class="question.cssClasses.imageContainer">
            <span v-if="question.cssClasses.checkedItemDecorator" :class="this.question.cssClasses.checkedItemDecorator">
              <sv-svg-icon v-if="question.cssClasses.checkedItemSvgIconId" v-bind:class="question.cssClasses.checkedItemSvgIcon" size="auto" :iconName="question.cssClasses.checkedItemSvgIconId"></sv-svg-icon>
            </span>
            <img
              v-if="item.imageLink && question.contentMode === 'image'"
              :class="question.cssClasses.image"
              :src="item.imageLink"
              :width="question.renderedImageWidth"
              :height="question.renderedImageHeight"
              v-bind:style="{ objectFit: question.imageFit }"
              :alt="item.locText.renderedHtml"
              @load="(event) => { question.onContentLoaded(item, event) }"

            /><video controls
              v-if="item.imageLink && question.contentMode === 'video'"
              :class="question.cssClasses.image"
              :src="item.imageLink"
              :width="question.renderedImageWidth"
              :height="question.renderedImageHeight"
              v-bind:style="{ objectFit: question.imageFit }"
              @loadedmetadata="(event) => { question.onContentLoaded(item, event) }"
            ></video>
            <div
              v-if="!item.imageLink"
              :class="question.cssClasses.itemNoImage"
              v-bind:style="{ width: question.renderedImageWidth, height: question.renderedImageHeight, objectFit: question.imageFit }"
            >
              <svg v-if="question.cssClasses.itemNoImageSvgIconId"
                :class="question.cssClasses.itemNoImageSvgIcon"
              >
                <use :xlink:href="question.cssClasses.itemNoImageSvgIconId"></use>
              </svg>
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
}
Vue.component("survey-imagepicker-item", ImagePickerItem);
export default ImagePickerItem;
</script>
