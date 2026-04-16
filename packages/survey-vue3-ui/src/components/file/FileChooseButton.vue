<template>
  <label
    tabindex="0"
    :class="item.getActionBarItemCss()"
    :for="question.inputId"
    v-bind:aria-label="question.chooseButtonText"
    v-key2click
    v-on:click="question.chooseFile($event)"
  >
    <SvComponent
      :is="'sv-svg-icon'"
      v-if="item.iconName"
      :title="question.chooseButtonText"
      :class="item.cssClasses.itemIcon"
      :iconName="question.cssClasses.chooseFileIconId"
      :size="'auto'"
    ></SvComponent>
    <StringViewer v-if="item.hasTitle" :model="item.locTitle" :textClass="item.getActionBarItemTitleCss()" />
  </label>
</template>
<script setup lang="ts">
import { key2ClickDirective as vKey2click } from "@/directives/key2click";
import SvComponent from "@/SvComponent.vue";
import StringViewer from "@/StringViewer.vue";
import type { QuestionFileModel, Action } from "survey-core";
import { computed } from "vue";
const props = defineProps<{
  item: Action;
}>();
const question = computed(
  () => props.item.data?.question as QuestionFileModel
);
</script>
