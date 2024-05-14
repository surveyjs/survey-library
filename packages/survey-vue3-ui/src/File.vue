<template>
  <div :class="question.fileRootCss" ref="root">
    <input
      :class="question.cssClasses.fileInput"
      v-if="!question.isReadOnly && question.hasFileUI"
      tabindex="-1"
      type="file"
      :id="question.inputId"
      :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel"
      :aria-invalid="question.ariaInvalid"
      :aria-errormessage="question.ariaErrormessage"
      :multiple="question.allowMultiple"
      v-bind:title="question.inputTitle"
      v-bind:accept="question.acceptedTypes"
      :capture="(question.renderCapture as any)"
    />
    <input
      v-if="question.isReadOnly"
      type="file"
      disabled
      :id="question.inputId"
      :class="question.getReadOnlyFileCss()"
      :multiple="question.allowMultiple"
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
        v-if="question.showFileDecorator"
      >
        <span :class="question.cssClasses.dragAreaPlaceholder">
          <survey-string
            :locString="question.locRenderedPlaceholder"
          ></survey-string>
        </span>
        <div :class="question.cssClasses.wrapper">
          <sv-file-choose-btn
            v-if="question.showChooseButton"
            :data="{ question: question }"
          ></sv-file-choose-btn>
          <sv-action-bar
            v-if="question.actionsContainerVisible"
            :model="question.actionsContainer"
          ></sv-action-bar>
          <span
            :class="question.cssClasses.noFileChosen"
            v-if="question.isEmpty()"
            >{{ question.noFileChosenCaption }}</span
          >
        </div>
      </div>
      <sv-file-clean-btn
        v-if="question.showRemoveButton"
        :question="question"
        :css="question.showRemoveButton"
      ></sv-file-clean-btn>
      <div
        :class="question.cssClasses.loadingIndicator"
        v-if="question.showLoadingIndicator"
      >
        <sv-loading-indicator></sv-loading-indicator>
      </div>
      <sv-file-video
        v-if="question.isPlayingVideo"
        :question="question"
      ></sv-file-video>
      <template v-if="question.allowShowPreview">
        <sv-file-preview :question="question"></sv-file-preview>
      </template>
      <sv-file-clean-btn
        v-if="question.showRemoveButtonBottom"
        :question="question"
        :css="question.showRemoveButtonBottom"
      ></sv-file-clean-btn>
      <sv-action-bar
        v-if="question.fileNavigatorVisible"
        :model="question.fileNavigator"
      ></sv-action-bar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { QuestionFileModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionFileModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
