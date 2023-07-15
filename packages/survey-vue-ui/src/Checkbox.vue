<template>
  <fieldset :class="question.getSelectBaseRootCss()" role="presentation">
    <legend role="presentation" class="sv-hidden"></legend>
    <template v-if="question.hasHeadItems">
      <survey-checkbox-item
        v-for="(item, index) in question.headItems"
        :key="item.value"
        :class="question.getItemClass(item)"
        :question="question"
        :item="item"
        :index="'' + index"
      ></survey-checkbox-item>
    </template>
    <template v-if="!question.hasColumns && !question.blockedRow">
      <survey-checkbox-item
        v-for="(item, index) in question.bodyItems"
        :key="item.value"
        :class="question.getItemClass(item)"
        :question="question"
        :item="item"
        :index="index"
      ></survey-checkbox-item>
    </template>
    <div :class="question.cssClasses.rootRow" v-if="question.blockedRow">
      <template v-if="!question.hasColumns && question.blockedRow">
        <survey-checkbox-item
          v-for="(item, index) in question.dataChoices"
          :key="item.value"
          :class="question.getItemClass(item)"
          :question="question"
          :item="item"
          :index="index"
        ></survey-checkbox-item>
      </template>
    </div>
    <div
      v-if="question.hasColumns"
      :class="question.cssClasses.rootMultiColumn"
    >
      <div
        v-for="(column, colIndex) in question.columns"
        :key="colIndex"
        :class="question.getColumnClass()"
        role="presentation"
      >
        <survey-checkbox-item
          v-for="(item, index) in column"
          :key="item.value"
          :class="question.getItemClass(item)"
          :question="question"
          :item="item"
          :index="'' + colIndex + index"
        ></survey-checkbox-item>
      </div>
    </div>
    <template v-if="question.hasFootItems">
      <survey-checkbox-item
        v-for="(item, index) in question.footItems"
        :key="item.value"
        :class="question.getItemClass(item)"
        :question="question"
        :item="item"
        :index="'' + index"
      ></survey-checkbox-item>
    </template>
    <survey-other-choice
      v-if="question.renderedValue && question.isOtherSelected"
      :question="question"
    />
  </fieldset>
</template>

<script lang="ts" setup>
import type { QuestionCheckboxModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
const props = defineProps<{ question: QuestionCheckboxModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
