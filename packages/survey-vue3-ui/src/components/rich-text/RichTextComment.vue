<template>
  <div v-if="!view.editing" ref="root" :class="question.getRootClass()">
    <div
      :class="classes(question.getControlClass(), view.css.display)"
      :style="view.displayStyle"
      :data-placeholder="view.displayPlaceholder"
      v-html="view.displayHtml"
    ></div>
    <SvComponent
      v-if="question.hasVisibleInputActions"
      :is="'sv-action-bar'"
      :model="question.inputActionsContainer"
    ></SvComponent>
  </div>

  <div v-else-if="view.source" ref="root" :class="view.css.source">
    <div :class="view.css.notice">{{ view.model.sourceNotice }}</div>
    <button type="button" :class="view.css.editAnyway" @click="view.model.editAnyway()">{{ view.model.editAnywayLabel }}</button>
    <SvComponent :is="'sv-text-area'" :model="question.textAreaModel"></SvComponent>
  </div>

  <div v-else ref="root" :class="classes(question.getRootClass(), view.css.editor, view.modifier, view.openClass)">
    <div
      ref="hostRef"
      :class="classes(question.getControlClass(), view.css.area)"
      contenteditable="true"
      role="textbox"
      :aria-multiline="view.model.mode === 'block' ? true : undefined"
      :aria-label="question.a11y_input_ariaLabel"
      :aria-labelledby="question.a11y_input_ariaLabelledBy"
      :aria-describedby="question.a11y_input_ariaDescribedBy"
      :aria-required="question.a11y_input_ariaRequired"
      :aria-invalid="question.a11y_input_ariaInvalid"
      :aria-errormessage="question.a11y_input_ariaErrormessage"
      :data-placeholder="view.model.placeholder || undefined"
      :id="question.inputId"
      :style="view.model.areaStyle"
    ></div>
    <div
      v-if="view.staticToolbar"
      :class="view.css.footer"
      role="toolbar"
      :aria-label="view.model.toolbarLabel"
      :aria-controls="question.inputId"
    >
      <SvComponent :is="'sv-action-bar'" :model="view.model.toolbar"></SvComponent>
      <div v-if="question.hasVisibleInputActions" :class="view.css.footerSpace"></div>
      <SvComponent
        v-if="question.hasVisibleInputActions"
        :is="'sv-action-bar'"
        :model="question.inputActionsContainer"
      ></SvComponent>
    </div>
    <SvComponent
      v-else-if="question.hasVisibleInputActions"
      :is="'sv-action-bar'"
      :model="question.inputActionsContainer"
    ></SvComponent>
    <div
      v-if="!view.staticToolbar && view.model.hasToolbar"
      :class="view.css.toolbar"
      role="toolbar"
      :aria-label="view.model.toolbarLabel"
      :aria-controls="question.inputId"
    >
      <SvComponent :is="'sv-action-bar'" :model="view.model.toolbar"></SvComponent>
    </div>
    <div v-if="question.resizeStyle !== 'none'" :class="question.cssClasses.grip" ref="gripRef">
      <SvComponent :is="'sv-svg-icon'" :iconName="question.cssClasses.gripIconId" :size="'auto'"></SvComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionCommentModel } from "survey-core";
import { ResizeManager } from "survey-core";
import { useQuestion } from "@/base";
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, shallowRef } from "vue";

defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionCommentModel }>();

const root = ref<HTMLElement>();
const hostRef = ref<HTMLElement>();
const gripRef = ref<HTMLElement>();
const stateTick = ref(0);
const editor = shallowRef<any>();
let resizeManager: ResizeManager | undefined;
let resizeTarget: HTMLElement | undefined;

function editorModel(question: QuestionCommentModel): any {
  const host: any = typeof globalThis !== "undefined" ? globalThis : window;
  const Ctor = host.SurveyRichText && host.SurveyRichText.RichTextEditorModel;
  const model = Ctor ? new Ctor(question) : undefined;
  if (model) model.onState = (): void => { stateTick.value++; };
  return model;
}

function releaseEditor(): void {
  disposeSizer();
  const current = editor.value;
  editor.value = undefined;
  if (!current) return;
  if (current.dispose) current.dispose();
  else current.detach();
}

// The property grid keeps this component and swaps the question. The editor follows that question.
onMounted(syncHost);
onUpdated(syncHost);
useQuestion(props, root, (question) => {
  releaseEditor();
  editor.value = editorModel(question);
});
onBeforeUnmount(releaseEditor);

// A new object on every editor notification. Vue skips a computed that returns the same model.
const view = computed(() => {
  const tick = stateTick.value;
  const model = editor.value;
  const classes = props.question.cssClasses;
  const mode = model && model.toolbarMode ? model.toolbarMode : "static";
  const editing = !!model && !!model.isEditing;
  const html = model ? model.displayHtml : "";
  const area = model ? model.areaStyle : undefined;
  let modifier = classes.toolbarStatic;
  if (mode === "none") modifier = classes.toolbarNone;
  else if (mode === "onSelection") modifier = classes.toolbarOnSelection;
  else if (mode === "onFocus") modifier = classes.toolbarOnFocus;
  return {
    tick,
    model,
    editing,
    source: editing && !!model.sourceMode,
    css: classes,
    displayHtml: html,
    displayStyle: area ? { minHeight: area.minHeight, height: area.height, overflow: area.overflow } : undefined,
    displayPlaceholder: !html && model && model.placeholder ? model.placeholder : undefined,
    staticToolbar: mode === "static",
    modifier,
    openClass: mode === "onSelection" && model && model.toolbarOpen ? classes.toolbarOpen : ""
  };
});

function classes(...names: Array<string | undefined | false>): string {
  return names.filter(name => !!name).join(" ");
}

// The framework does not own the editing host's HTML. The model writes it on attach.
function syncHost(): void {
  const current = editor.value;
  const host = hostRef.value;
  if (current && current.isAttached && !host) current.detach();
  if (current && host && !current.isAttached) current.attach(host);
  updateSizer();
}

// The comment's grip. It changes the height of the editing area and leaves the width alone.
function updateSizer(): void {
  const question = props.question;
  const grip = gripRef.value;
  const target = hostRef.value;
  if (!question || question.resizeStyle === "none" || !grip || !target) {
    disposeSizer();
    return;
  }
  if (resizeManager && resizeTarget === target) return;
  disposeSizer();
  resizeTarget = target;
  resizeManager = new ResizeManager(grip, target, "vertical");
}

function disposeSizer(): void {
  if (resizeManager) resizeManager.dispose();
  resizeManager = undefined;
  resizeTarget = undefined;
}
</script>
