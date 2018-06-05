<template>
    <div :class="question.cssClasses.root">
        <input :class="question.cssClasses.fileInput" v-if="!question.isReadOnly" type="file" :id="question.inputId" @change="doChange" v-bind:aria-label="question.locTitle.renderedHtml" :multiple="question.allowMultiple ? 'multiple' : undefined" v-bind:title="question.inputTitle" v-bind:accept="question.acceptedTypes" v-bind:style="{color: question.currentState === 'loaded' ? 'inherit' : 'transparent'}"/>
        <button v-if="!question.isEmpty()" :class="question.cssClasses.removeButton" @click="doClean">{{question.cleanButtonCaption}}</button>
        <input v-if="question.isReadOnly" type="text" readonly :class="getPlaceholderClass()" :placeholder="question.title" />
        <div v-if="!question.isEmpty()">
            <img v-for="(val, index) in question.previewValue" :key="question.inputId + '_' + index" v-show="val" :class="question.cssClasses.preview" :src="val" :height="question.imageHeight" :width="question.imageWidth" alt="File preview"/>
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
    this.question.loadFiles(files);
  }
  doClean(event) {
    var src = event.target || event.srcElement;
    this.question.clear();
    src.parentElement.querySelectorAll("input")[0].value = "";
  }
  getPlaceholderClass() {
    return "form-control " + this.question.cssClasses.placeholderInput;
  }
}
Vue.component("survey-file", File);
export default File;
</script>
