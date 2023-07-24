<template>
  <fieldset
    role="presentation"
    :class="question.getSelectBaseRootCss()"
    ref="root"
  >
    <survey-radiogroup-item
      v-if="!question.hasColumns && !question.blockedRow"
      v-for="(item, index) in question.visibleChoices"
      :key="item.value"
      :class="question.getItemClass(item)"
      :question="question"
      :item="item"
      :index="index"
    ></survey-radiogroup-item>
    <div :class="question.cssClasses.rootRow" v-if="question.blockedRow">
      <survey-radiogroup-item
        v-if="!question.hasColumns && question.blockedRow"
        v-for="(item, index) in question.dataChoices"
        :key="item.value"
        :class="question.getItemClass(item)"
        :question="question"
        :item="item"
        :index="index"
      ></survey-radiogroup-item>
    </div>
    <div
      v-if="question.hasColumns"
      :class="question.cssClasses.rootMultiColumn"
    >
      <div
        v-if="question.hasColumns"
        v-for="(column, colIndex) in question.columns"
        :class="question.getColumnClass()"
        role="presentation"
      >
        <survey-radiogroup-item
          v-for="(item, index) in column"
          :key="item.value"
          :class="question.getItemClass(item)"
          :question="question"
          :item="item"
          :index="'' + colIndex + index"
        ></survey-radiogroup-item>
      </div>
    </div>
    <survey-radiogroup-item
      v-for="(item, index) in question.footItems"
      v-if="question.hasFootItems"
      :key="item.value"
      :class="question.getItemClass(item)"
      :question="question"
      :item="item"
      :index="'' + index"
    ></survey-radiogroup-item>
    <survey-other-choice
      v-if="question.renderedValue && question.isOtherSelected"
      :question="question"
    />
    <div v-if="question.showClearButtonInContent">
      <input
        type="button"
        :class="question.cssClasses.clearButton"
        v-on:click="
          () => {
            question.clearValue();
          }
        "
        :value="question.clearButtonCaption"
      />
    </div>
  </fieldset>
</template>

<script lang="ts" setup>
import type { QuestionRadiogroupModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
const props = defineProps<{ question: QuestionRadiogroupModel }>();
const root = ref(null);
useQuestion<QuestionRadiogroupModel>(props, root);
</script>
