<template>
  <div :class="question.fileRootCss" ref="root">
    <input
      :class="question.cssClasses.fileInput"
      v-if="
        !question.isReadOnlyAttr &&
        !question.isDisabledAttr &&
        question.hasFileUI
      "
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
      v-if="question.isReadOnlyAttr"
      type="file"
      readonly
      :id="question.inputId"
      :class="question.getReadOnlyFileCss()"
      :multiple="question.allowMultiple"
      :placeholder="question.title"
      style="color: transparent"
    />
    <input
      v-if="question.isDisabledAttr"
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
          <SvComponent
            :is="'survey-string'"
            :locString="question.locRenderedPlaceholder"
          ></SvComponent>
        </span>
        <div :class="question.cssClasses.wrapper">
          <SvComponent
            :is="'sv-file-choose-btn'"
            v-if="question.showChooseButton"
            :data="{ question: question }"
          ></SvComponent>
          <SvComponent
            :is="'sv-action-bar'"
            v-if="question.actionsContainerVisible"
            :model="question.actionsContainer"
          ></SvComponent>
          <span
            :class="question.cssClasses.noFileChosen"
            v-if="question.isEmpty()"
            >{{ question.noFileChosenCaption }}</span
          >
        </div>
      </div>
      <SvComponent
        :is="'sv-file-clean-btn'"
        v-if="question.showRemoveButton"
        :question="question"
        :css="question.showRemoveButton"
      ></SvComponent>
      <div
        :class="question.cssClasses.loadingIndicator"
        v-if="question.showLoadingIndicator"
      >
        <SvComponent :is="'sv-loading-indicator'" />
      </div>
      <SvComponent
        :is="'sv-file-video'"
        v-if="question.isPlayingVideo"
        :question="question"
      ></SvComponent>
      <template v-if="question.allowShowPreview">
        <SvComponent :is="'sv-file-preview'" :question="question" />
      </template>
      <SvComponent
        :is="'sv-file-clean-btn'"
        v-if="question.showRemoveButtonBottom"
        :question="question"
        :css="question.showRemoveButtonBottom"
      ></SvComponent>
      <SvComponent
        :is="'sv-action-bar'"
        v-if="question.fileNavigatorVisible"
        :model="question.fileNavigator"
      ></SvComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionFileModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionFileModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
