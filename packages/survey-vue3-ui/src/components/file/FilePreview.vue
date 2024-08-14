<template>
  <div
    v-if="question.showPreviewContainer"
    :class="question.cssClasses.fileList || undefined"
  >
    <span
      v-for="(val, index) in question.previewValue"
      :key="question.inputId + '_' + index"
      v-show="val && question.isPreviewVisible(index)"
      :class="question.cssClasses.previewItem"
      @click="question.doDownloadFileFromContainer($event)"
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
        <SvComponent
          :name="'sv-svg-icon'"
          v-if="question.defaultImage(val)"
          :iconName="question.cssClasses.defaultImageIconId"
          :class="question.cssClasses.defaultImage"
          :size="'auto'"
        ></SvComponent>
        <div
          v-if="val.name && !question.isReadOnly"
          :class="question.getRemoveButtonCss()"
          @click="question.doRemoveFile(val, $event)"
        >
          <span :class="question.cssClasses.removeFile">{{
            question.removeFileCaption
          }}</span>
          <SvComponent
            :name="'sv-svg-icon'"
            v-if="question.cssClasses.removeFileSvgIconId"
            :title="question.removeFileCaption"
            :class="question.cssClasses.removeFileSvg"
            :iconName="question.cssClasses.removeFileSvgIconId"
            :size="'auto'"
          ></SvComponent>
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

<script setup lang="ts">
import type { QuestionFileModel } from "survey-core";
import SvComponent from "@/SvComponent.vue";
defineProps<{ question: QuestionFileModel }>();
</script>
