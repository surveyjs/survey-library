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
          <SurveyVueComponent
            :name="'survey-string'"
            :locString="question.locRenderedPlaceholder"
          ></SurveyVueComponent>
        </span>
        <div :class="question.cssClasses.wrapper">
          <SurveyVueComponent
            :name="'sv-file-choose-btn'"
            v-if="question.showChooseButton"
            :data="{ question: question }"
          ></SurveyVueComponent>
          <SurveyVueComponent
            :name="'sv-action-bar'"
            v-if="question.actionsContainerVisible"
            :model="question.actionsContainer"
          ></SurveyVueComponent>
          <span
            :class="question.cssClasses.noFileChosen"
            v-if="question.isEmpty()"
            >{{ question.noFileChosenCaption }}</span
          >
        </div>
      </div>
      <SurveyVueComponent
        :name="'sv-file-clean-btn'"
        v-if="question.showRemoveButton"
        :question="question"
        :css="question.showRemoveButton"
      ></SurveyVueComponent>
      <div
        :class="question.cssClasses.loadingIndicator"
        v-if="question.showLoadingIndicator"
      >
        <SurveyVueComponent :name="'sv-loading-indicator'" />
      </div>
      <SurveyVueComponent
        :name="'sv-file-video'"
        v-if="question.isPlayingVideo"
        :question="question"
      ></SurveyVueComponent>
      <template v-if="question.allowShowPreview">
        <SurveyVueComponent
          :name="'sv-file-preview'"
          :question="question"
        ></SurveyVueComponent>
      </template>
      <SurveyVueComponent
        :name="'sv-file-clean-btn'"
        v-if="question.showRemoveButtonBottom"
        :question="question"
        :css="question.showRemoveButtonBottom"
      ></SurveyVueComponent>
      <SurveyVueComponent
        :name="'sv-action-bar'"
        v-if="question.fileNavigatorVisible"
        :model="question.fileNavigator"
      ></SurveyVueComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import type { QuestionFileModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionFileModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
