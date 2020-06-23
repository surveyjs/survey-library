<template>
    <fieldset :class="question.cssClasses.root">
        <legend v-bind:aria-label="question.locTitle.renderedHtml"></legend>
        <div v-for="(item, index) in question.visibleChoices" :key="item.value" :class="getItemClass(item)" >
            <label :class="question.cssClasses.label">
                <input v-if="question.multiSelect" style="display: none;" type="checkbox" :name="question.name + '_' + question.id" :value="item.value" :id="question.inputId + '_' + item.value" v-model="question.value" :disabled="question.isReadOnly || !item.isEnabled" v-bind:aria-required="question.isRequired" :aria-label="question.locTitle.renderedHtml" :aria-invalid="question.errors.length > 0" :aria-describedby="question.errors.length > 0 ? question.id + '_errors' : null" :class="question.cssClasses.itemControl"/>
                <input v-else style="display: none;" type="radio" :name="question.name + '_' + question.id" :value="item.value" :id="question.inputId + '_' + item.value" v-model="question.value" :disabled="question.isReadOnly || !item.isEnabled" v-bind:aria-required="question.isRequired" :aria-label="question.locTitle.renderedHtml" :aria-invalid="question.errors.length > 0" :aria-describedby="question.errors.length > 0 ? question.id + '_errors' : null" :class="question.cssClasses.itemControl"/>
                <div>
                    <img v-if="question.contentMode === 'image'" :class="question.cssClasses.image" :src="item.imageLink" :width="question.imageWidth ? question.imageWidth + 'px' : undefined" :height="question.imageHeight ? question.imageHeight + 'px' : undefined" v-bind:style="{ objectFit: question.imageFit }" :alt="item.text || item.value"/>
                    <embed v-if="question.contentMode === 'video'" :class="question.cssClasses.image" :src="item.imageLink" :width="question.imageWidth ? question.imageWidth + 'px' : undefined" :height="question.imageHeight ? question.imageHeight + 'px' : undefined" v-bind:style="{ objectFit: question.imageFit }"/>
                    <span v-if="question.showLabel" :title="item.text || item.value" :class="question.cssClasses.itemText">{{item.text || item.value}}</span>
                </div>
            </label>
        </div>
    </fieldset> 
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionImagePickerModel } from "../question_imagepicker";

@Component
export class ImagePicker extends QuestionVue<QuestionImagePickerModel> {
  getItemClass(item:any) {
  var question = this.question;
  var cssClasses = question.cssClasses;
  var colCount = question.colCount;
  var itemClass =
      cssClasses.item +
      (colCount === 0
        ? " " + cssClasses.itemInline
        : " sv-q-col-" + colCount);
    var isChecked = this.question.isItemSelected(item);
    var isDisabled = question.isReadOnly || !item.isEnabled; 
    var allowHover = !isChecked && !isDisabled;
    if (isChecked) {
      itemClass += " " + cssClasses.itemChecked;
    }
    if (isDisabled) {
      itemClass += " " + cssClasses.itemDisabled;
    }
    if (allowHover) {
      itemClass += " " + cssClasses.itemHover;
    }
    return itemClass;
  }
}
Vue.component("survey-imagepicker", ImagePicker);
export default ImagePicker;
</script>
