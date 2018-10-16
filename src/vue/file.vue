<template>
    <div :class="question.cssClasses.root">
        <input :class="question.cssClasses.fileInput" v-if="!question.isReadOnly" type="file" :id="question.inputId" @change="doChange" v-bind:aria-label="question.locTitle.renderedHtml" :multiple="question.allowMultiple ? 'multiple' : undefined" v-bind:title="question.inputTitle" v-bind:accept="question.acceptedTypes" />
        <button v-if="!question.isReadOnly && !question.isEmpty()" :class="question.cssClasses.removeButton" @click="doClean">{{question.cleanButtonCaption}}</button>
        <input v-if="question.isReadOnly" type="file" disabled :class="getPlaceholderClass()" :placeholder="question.title" style="color: transparent;"/>
        <div v-if="!question.isEmpty()">
            <span v-for="(val, index) in question.previewValue" :key="question.inputId + '_' + index" v-show="val" :class="question.cssClasses.preview">
                <div v-if="val.name">
                  <a :href="val.content" :title="val.name" :download="val.name" :width="question.imageWidth">{{val.name}}</a>
                </div>
                <img v-if="question.canPreviewImage(val)" :src="val.content" :height="question.imageHeight" :width="question.imageWidth" alt="File preview">
                <div v-if="val.name">
                  <span v-if="!question.isReadOnly" @click="doRemoveFile(val)" :class="question.cssClasses.removeFile">{{question.removeFileCaption}}</span>
                </div>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionFileModel } from "../question_file";

@Component
export class File extends QuestionVue<QuestionFileModel> {
  doChange(e) {
    var src = e.target || e.srcElement;
    if (!window["FileReader"]) return;
    if (!src || !src.files || src.files.length < 1) return;
    let files = [];
    for (let i = 0; i < src.files.length; i++) {
      files.push(src.files[i]);
    }
    src.value = "";
    this.question.loadFiles(files);
  }
  doClean(event: any) {
    var src = event.target || event.srcElement;
    this.question.clear();
    src.parentElement.querySelectorAll("input")[0].value = "";
  }
  doRemoveFile(data) {
    this.question.removeFile(data);
  }
  getPlaceholderClass() {
    return "form-control " + this.question.cssClasses.placeholderInput;
  }
}
Vue.component("survey-file", File);
export default File;
</script>
