<template>
  <div v-if="question.showPreviewContainer" :class="question.cssClasses.fileList || undefined">
    <span
      v-for="(val, index) in question.previewValue"
      :key="question.inputId + '_' + index"
      v-show="val && isPreviewVisible(index)"
      :class="question.cssClasses.previewItem"
    >
      <div
        v-if="val.name && question.cssClasses.fileSign"
        :class="question.cssClasses.fileSign"
      >
        <a
          @click="question.doDownloadFile($event, val)"
          :href="val.content"
          :title="val.name"
          :download="val.name"
          :style="{ width: question.imageWidth }"
          >{{ val.name }}</a
        >
      </div>
      <div :class="question.getImageWrapperCss(val)">
        <img
          v-if="question.canPreviewImage(val)"
          :src="val.content"
          :style="{
            height: question.imageHeight,
            width: question.imageWidth,
          }"
          alt="File preview"
        />
        <sv-svg-icon
          v-if="question.defaultImage(val)"
          :iconName="question.cssClasses.defaultImageIconId"
          :class="question.cssClasses.defaultImage"
          :size="'auto'"
        ></sv-svg-icon>
        <div
          v-if="val.name && !question.isReadOnly"
          :class="question.getRemoveButtonCss()"
          @click="question.doRemoveFile(val)"
        >
          <span :class="question.cssClasses.removeFile">{{
            question.removeFileCaption
          }}</span>
          <sv-svg-icon
            v-if="question.cssClasses.removeFileSvgIconId"
            :title="question.removeFileCaption"
            :class="question.cssClasses.removeFileSvg"
            :iconName="question.cssClasses.removeFileSvgIconId"
            :size="'auto'"
          ></sv-svg-icon>
        </div>
      </div>
      <div
        v-if="val.name && question.cssClasses.fileSignBottom"
        :class="question.cssClasses.fileSignBottom"
      >
        <a
          @click="question.doDownloadFile($event, val)"
          :href="val.content"
          :title="val.name"
          :download="val.name"
          :style="{ width: question.imageWidth }"
          >{{ val.name }}</a
        >
      </div>
    </span>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { QuestionFileModel } from "survey-core";
@Component
export class FilePreview extends Vue {
  @Prop() question: QuestionFileModel;
  isPreviewVisible(index: any) {
    return this.question.isPreviewVisible(index);
  }
}
Vue.component("sv-file-preview", FilePreview);
export default FilePreview;
</script>