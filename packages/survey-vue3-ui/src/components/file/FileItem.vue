<template>
  <span
    v-show="item"
    :class="question.cssClasses.previewItem"
    @click="question.doDownloadFileFromContainer($event)"
  >
    <div
      v-if="item.name && question.cssClasses.fileSign"
      :class="question.cssClasses.fileSign"
    >
      <a
        @click="question.doDownloadFile($event, item)"
        :href="item.content"
        :title="item.name"
        :download="item.name"
        :style="{ width: question.imageWidth }"
        >{{ item.name }}</a
      >
    </div>
    <div :class="question.getImageWrapperCss(item)">
      <img
        v-if="question.canPreviewImage(item)"
        :src="item.content"
        :style="{
          height: question.imageHeight,
          width: question.imageWidth,
        }"
        alt="File preview"
      />
      <SvComponent
        :is="'sv-svg-icon'"
        v-if="question.defaultImage(item)"
        :iconName="question.cssClasses.defaultImageIconId"
        :class="question.cssClasses.defaultImage"
        :size="'auto'"
      ></SvComponent>
      <div
        v-if="item.name && !question.isReadOnly"
        :class="question.getRemoveButtonCss()"
        @click="question.doRemoveFile(item, $event)"
      >
        <span :class="question.cssClasses.removeFile">{{
          question.removeFileCaption
        }}</span>
        <SvComponent
          :is="'sv-svg-icon'"
          v-if="question.cssClasses.removeFileSvgIconId"
          :title="question.removeFileCaption"
          :class="question.cssClasses.removeFileSvg"
          :iconName="question.cssClasses.removeFileSvgIconId"
          :size="'auto'"
        />
      </div>
    </div>
    <div
      v-if="item.name && question.cssClasses.fileSignBottom"
      :class="question.cssClasses.fileSignBottom"
    >
      <a
        @click="question.doDownloadFile($event, item)"
        :href="item.content"
        :title="item.name"
        :download="item.name"
        :style="{ width: question.imageWidth }"
        >{{ item.name }}</a
      >
    </div>
  </span>
</template>
<script lang="ts" setup>
import type { QuestionFileModel } from "survey-core";
import SvComponent from "@/SvComponent.vue";
defineProps<{ item: any; question: QuestionFileModel }>();
</script>
