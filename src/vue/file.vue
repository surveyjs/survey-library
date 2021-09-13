<template>
  <div :class="question.cssClasses.root">
    <input
      :class="question.cssClasses.fileInput"
      v-if="!question.isReadOnly"
      type="file"
      :id="question.inputId"
      @change="question.doChange"
      :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel"
      :aria-invalid="question.ariaInvalid"
      :aria-describedby="question.ariaDescribedBy"
      :multiple="question.allowMultiple ? 'multiple' : undefined"
      v-bind:title="question.inputTitle"
      v-bind:accept="question.acceptedTypes"
    />
    <input
      v-if="question.isReadOnly"
      type="file"
      disabled
      :class="question.getReadOnlyFileCss()"
      :placeholder="question.title"
      style="color: transparent"
    />
    <div
      :class="question.cssClasses.fileDecorator"
      @drop="question.onDrop"
      @dragover="question.onDragOver"
    >
      <div :class="question.cssClasses.wrapper">
        <label
          role="button"
          :class="question.getChooseFileCss()"
          :for="question.inputId"
          v-bind:aria-label="question.chooseButtonCaption"
          >{{ question.chooseButtonCaption }}</label
        >
        <span
          :class="question.cssClasses.noFileChosen"
          v-if="question.isEmpty()"
          >{{ question.noFileChosenCaption }}</span
        >
      </div>
    </div>
    <button
      type="button"
      v-if="!question.isReadOnly && !question.isEmpty()"
      :class="question.cssClasses.removeButton"
      @click="question.doClean"
    >
      {{ question.cleanButtonCaption }}
    </button>
    <div v-if="!question.isEmpty()">
      <span
        v-for="(val, index) in question.previewValue"
        :key="question.inputId + '_' + index"
        v-show="val"
        :class="question.cssClasses.preview"
      >
        <div v-if="val.name" :class="question.cssClasses.fileSign">
          <a
            @click="question.doDownloadFile($event, val)"
            :href="val.content"
            :title="val.name"
            :download="val.name"
            :width="question.imageWidth"
            >{{ val.name }}</a
          >
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
            @click="question.doRemoveFile(val)"
            :class="question.cssClasses.removeFile"
            >{{ question.removeFileCaption }}</span
          >
          <svg
            :class="question.cssClasses.removeFileSvg"
            @click="question.doRemoveFile(val)"
            viewBox="0 0 16 16"
          >
            <path
              d="M8,2C4.7,2,2,4.7,2,8s2.7,6,6,6s6-2.7,6-6S11.3,2,8,2z M11,10l-1,1L8,9l-2,2l-1-1l2-2L5,6l1-1l2,2l2-2l1,1L9,8 L11,10z"
            />
          </svg>
        </div>
        <div v-if="val.name" :class="question.cssClasses.fileSignBottom">
          <a
            @click="question.doDownloadFile($event, val)"
            :href="val.content"
            :title="val.name"
            :download="val.name"
            :width="question.imageWidth"
            >{{ val.name }}</a
          >
        </div>
      </span>
    </div>
    <button
      type="button"
      v-if="!question.isReadOnly && !question.isEmpty()"
      :class="question.cssClasses.removeButtonBottom"
      @click="question.doClean"
    >
      {{ question.cleanButtonCaption }}
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionFileModel } from "survey-core";
import { confirmAction, detectIEOrEdge, loadFileFromBase64 } from "survey-core";
@Component
export class File extends QuestionVue<QuestionFileModel> {
  doRemoveFile(data: any) {
    this.question.doRemoveFile(data);
  }

}
Vue.component("survey-file", File);
export default File;
</script>
