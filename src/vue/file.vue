<template>
    <div :class="question.cssClasses.root">
        <input :class="question.cssClasses.fileInput" v-if="!question.isReadOnly" type="file" :id="question.inputId" @change="doChange" v-bind:aria-required="question.isRequired" :aria-label="question.locTitle.renderedHtml" :multiple="question.allowMultiple ? 'multiple' : undefined" v-bind:title="question.inputTitle" v-bind:accept="question.acceptedTypes" />
        <input v-if="question.isReadOnly" type="file" disabled :class="getPlaceholderClass()" :placeholder="question.title" style="color: transparent;"/>
        <div :class="question.cssClasses.fileDecorator" @drop="onDrop" @dragover="onDragOver">
          <label :class="question.cssClasses.chooseFile + (question.isReadOnly ? ' ' + question.cssClasses.disabled : '')" :for="question.inputId">{{question.chooseButtonCaption}}</label>
          <span :class="question.cssClasses.noFileChosen" v-if="question.isEmpty()">{{question.noFileChosenCaption}}</span>             
        </div>
        <button type="button" v-if="!question.isReadOnly && !question.isEmpty()" :class="question.cssClasses.removeButton" @click="doClean">{{question.cleanButtonCaption}}</button>
        <div v-if="!question.isEmpty()">
            <span v-for="(val, index) in question.previewValue" :key="question.inputId + '_' + index" v-show="val" :class="question.cssClasses.preview">
                <div v-if="val.name" :class="question.cssClasses.fileSign">
                  <a :href="val.content" :title="val.name" :download="val.name" :width="question.imageWidth">{{val.name}}</a>
                </div>
                <img v-if="question.canPreviewImage(val)" :src="val.content" :height="question.imageHeight" :width="question.imageWidth" alt="File preview">
                <div v-if="val.name && !question.isReadOnly">
                  <span @click="doRemoveFile(val)" :class="question.cssClasses.removeFile">{{question.removeFileCaption}}</span>
                  <svg  @click="doRemoveFile(val)" :class="question.cssClasses.removeFileSvg" viewBox="0 0 14 14"></svg>                
                </div>
                  <div v-if="val.name" :class="question.cssClasses.fileSignBottom">
                  <a :href="val.content" :title="val.name" :download="val.name" :width="question.imageWidth">{{val.name}}</a>
                </div>
            </span>
        </div>
        <button type="button" v-if="!question.isReadOnly && !question.isEmpty()" :class="question.cssClasses.removeButtonBottom" @click="doClean">{{question.cleanButtonCaption}}</button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionFileModel } from "../question_file";

@Component
export class File extends QuestionVue<QuestionFileModel> {
  onDragOver = (event: any) => {
    event.preventDefault();
    }; 
  onDrop = (event: any) => {
    event.preventDefault();
    let src = event.dataTransfer;
    this.onChange(src);
  };
  doChange(event: any) {
    var src = event.target || event.srcElement;
    this.onChange(src);
  }
  doClean(event: any) {
    var src = event.target || event.srcElement;
    this.question.clear();
    src.parentElement.querySelectorAll("input")[0].value = "";
  }
  doRemoveFile(data: any) {
    this.question.removeFile(data);
  }
  getPlaceholderClass() {
    return "form-control " + this.question.cssClasses.placeholderInput;
  }
  private onChange(src: any) {
    if (!(<any>window)["FileReader"]) return;
    if (!src || !src.files || src.files.length < 1) return;
    let files = [];
    let allowCount = this.question.allowMultiple ? src.files.length : 1;
    for (let i = 0; i < allowCount; i++) {
      files.push(src.files[i]);
    }
    src.value = "";
    this.question.loadFiles(files);
  }
}
Vue.component("survey-file", File);
export default File;
</script>
