<template>
  <div :class="question.fileRootCss">
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
      :multiple="question.multipleRendered"
      v-bind:title="question.inputTitle"
      v-bind:accept="question.acceptedTypes"
    />
    <input
      v-if="question.isReadOnly"
      type="file"
      disabled
      :class="question.getReadOnlyFileCss()"
      :multiple="question.multipleRendered"
      :placeholder="question.title"
      style="color: transparent"
    />
    <div 
      :class="question.cssClasses.dragArea"
      @drop="question.onDrop"
      @dragover="question.onDragOver"
      @dragleave="question.onDragLeave"
      @dragenter="question.onDragEnter"
    >
      <div
        :class="question.getFileDecoratorCss()"
      >
        <span :class="question.cssClasses.dragAreaPlaceholder">{{ question.dragAreaPlaceholder }}</span>
        <div :class="question.cssClasses.wrapper">
          <label
            role="button"
            :class="question.getChooseFileCss()"
            :for="question.inputId"
            v-bind:aria-label="question.chooseButtonCaption"
            >
            <span>{{ question.chooseButtonCaption }}</span>
            <sv-svg-icon v-if="question.cssClasses.chooseFileIconId" :title="question.chooseButtonCaption" :iconName="question.cssClasses.chooseFileIconId" :size="'auto'"></sv-svg-icon>
          </label>
          <span
            :class="question.cssClasses.noFileChosen"
            v-if="question.isEmpty()"
            >{{ question.noFileChosenCaption }}</span
          >
        </div>
      </div>
      <button
        type="button"
        v-if="question.showRemoveButton"
        :class="question.cssClasses.removeButton"
        @click="question.doClean"
      >
        <span>{{ question.cleanButtonCaption }}</span>
        <sv-svg-icon v-if="question.cssClasses.removeButtonIconId" :iconName="question.cssClasses.removeButtonIconId" :size="'auto'" :title="question.cleanButtonCaption"></sv-svg-icon>
      </button>
      <div :class="question.cssClasses.fileList || undefined" v-if="!question.isEmpty()">
        <span
          v-for="(val, index) in question.previewValue"
          :key="question.inputId + '_' + index"
          v-show="val && question.isPreviewVisible(index)"
          :class="question.cssClasses.preview"
        >
          <div v-if="val.name && question.cssClasses.fileSign" :class="question.cssClasses.fileSign">
            <a
              @click="question.doDownloadFile($event, val)"
              :href="val.content"
              :title="val.name"
              :download="val.name"
              :width="question.imageWidth"
              >{{ val.name }}</a
            >
          </div>
          <div :class="question.cssClasses.imageWrapper">
            <img
              v-if="question.canPreviewImage(val)"
              :src="val.content"
              :height="question.imageHeight"
              :width="question.imageWidth"
              alt="File preview"
            />
            <sv-svg-icon v-if="question.defaultImage(val)" 
              :iconName="question.cssClasses.defaultImageIconId" :class="question.cssClasses.defaultImage" :size="'auto'"></sv-svg-icon>
            <div v-if="val.name && !question.isReadOnly" :class="question.cssClasses.removeFileButton" @click="question.doRemoveFile(val)">
              <span
                :class="question.cssClasses.removeFile"
                >{{ question.removeFileCaption }}</span
              >
              <sv-svg-icon v-if="question.cssClasses.removeFileSvgIconId" :title="question.removeFileCaption" :class="question.cssClasses.removeFileSvg" :iconName="question.cssClasses.removeFileSvgIconId" :size="'auto'"></sv-svg-icon>
            </div>
          </div>
          <div v-if="val.name && question.cssClasses.fileSignBottom" :class="question.cssClasses.fileSignBottom">
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
        v-if="question.showRemoveButtonBottom"
        :class="question.showRemoveButtonBottom"
        @click="question.doClean"
      >
        <span>{{ question.cleanButtonCaption }}</span>
        <sv-svg-icon v-if="question.cssClasses.removeButtonIconId" :iconName="question.cssClasses.removeButtonIconId" :size="'auto'" :title="question.cleanButtonCaption"></sv-svg-icon>
      </button>
      <sv-action-bar v-if="question.mobileFileNavigatorVisible" :model="question.mobileFileNavigator"></sv-action-bar>
    </div>
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
