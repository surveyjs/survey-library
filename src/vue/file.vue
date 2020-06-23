<template>
  <div :class="question.cssClasses.root">
    <input
      :class="question.cssClasses.fileInput"
      v-if="!question.isReadOnly"
      type="file"
      :id="question.inputId"
      @change="doChange"
      v-bind:aria-required="question.isRequired"
      :aria-label="question.locTitle.renderedHtml"
      :aria-invalid="question.errors.length > 0"
      :aria-describedby="question.errors.length > 0 ? question.id + '_errors' : null"  
      :multiple="question.allowMultiple ? 'multiple' : undefined"
      v-bind:title="question.inputTitle"
      v-bind:accept="question.acceptedTypes"
    />
    <input
      v-if="question.isReadOnly"
      type="file"
      disabled
      :class="getPlaceholderClass()"
      :placeholder="question.title"
      style="color: transparent;"
    />
    <div :class="question.cssClasses.fileDecorator" @drop="onDrop" @dragover="onDragOver">
      <div :class="question.cssClasses.wrapper">
        <label
          role="button"
          :class="question.cssClasses.chooseFile + (question.isReadOnly ? ' ' + question.cssClasses.disabled : '')"
          :for="question.inputId"
          v-bind:aria-label="question.chooseButtonCaption"
        >{{question.chooseButtonCaption}}</label>
        <span
          :class="question.cssClasses.noFileChosen"
          v-if="question.isEmpty()"
        >{{question.noFileChosenCaption}}</span>
      </div>
    </div>
    <button
      type="button"
      v-if="!question.isReadOnly && !question.isEmpty()"
      :class="question.cssClasses.removeButton"
      @click="doClean"
    >{{question.cleanButtonCaption}}</button>
    <div v-if="!question.isEmpty()">
      <span
        v-for="(val, index) in question.previewValue"
        :key="question.inputId + '_' + index"
        v-show="val"
        :class="question.cssClasses.preview"
      >
        <div v-if="val.name" :class="question.cssClasses.fileSign">
          <a
            @click="doDownloadFile($event, val)"
            :href="val.content"
            :title="val.name"
            :download="val.name"
            :width="question.imageWidth"
          >{{val.name}}</a>
        </div>
        <img
          v-if="question.canPreviewImage(val)"
          :src="val.content"
          :height="question.imageHeight"
          :width="question.imageWidth"
          alt="File preview"
        />
        <div v-if="val.name && !question.isReadOnly">
          <span
            @click="doRemoveFile(val)"
            :class="question.cssClasses.removeFile"
          >{{question.removeFileCaption}}</span>
          <svg
            :class="question.cssClasses.removeFileSvg"
            @click="doRemoveFile(val)"
            viewBox="0 0 16 16"
          >
            <path
              d="M8,2C4.7,2,2,4.7,2,8s2.7,6,6,6s6-2.7,6-6S11.3,2,8,2z M11,10l-1,1L8,9l-2,2l-1-1l2-2L5,6l1-1l2,2l2-2l1,1L9,8 L11,10z"
            />
          </svg>
        </div>
        <div v-if="val.name" :class="question.cssClasses.fileSignBottom">
          <a
            @click="doDownloadFile($event, val)"
            :href="val.content"
            :title="val.name"
            :download="val.name"
            :width="question.imageWidth"
          >{{val.name}}</a>
        </div>
      </span>
    </div>
    <button
      type="button"
      v-if="!question.isReadOnly && !question.isEmpty()"
      :class="question.cssClasses.removeButtonBottom"
      @click="doClean"
    >{{question.cleanButtonCaption}}</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionFileModel } from "../question_file";
import {
  confirmAction,
  detectIEOrEdge,
  loadFileFromBase64
} from "../utils/utils";
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
    var question = this.question;
    var src = event.target || event.srcElement;
    if (question.needConfirmRemoveFile) {
      var isConfirmed = confirmAction(question.confirmRemoveAllMessage);
      if (!isConfirmed) return;
    }
    question.clear();
    src.parentElement.querySelectorAll("input")[0].value = "";
  }
  doRemoveFile(data: any) {
    var question = this.question;
    if (question.needConfirmRemoveFile) {
      var isConfirmed = confirmAction(
        question.getConfirmRemoveMessage(data.name)
      );
      if (!isConfirmed) return;
    }
    question.removeFile(data);
  }
  doDownloadFile(event: any, data: any) {
    if (detectIEOrEdge()) {
      event.preventDefault();
      loadFileFromBase64(data.content, data.name);
    }
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
