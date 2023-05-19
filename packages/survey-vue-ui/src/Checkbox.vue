<template>
  <fieldset :class="question.getSelectBaseRootCss()" role="presentation">
    <legend role="presentation" class="sv-hidden"></legend>
    <survey-checkbox-item
        v-for="(item, index) in question.headItems"
        v-if="question.hasHeadItems"
        :key="item.value"
        :class="question.getItemClass(item)"
        :question="question"
        :item="item"
        :index="'' + index"
      ></survey-checkbox-item>
    <survey-checkbox-item
      v-if="!question.hasColumns && !question.blockedRow"
      v-for="(item, index) in question.bodyItems"
      :key="item.value"
      :class="question.getItemClass(item)"
      :question="question"
      :item="item"
      :index="index"
    ></survey-checkbox-item>
    <div :class="question.cssClasses.rootRow" v-if="question.blockedRow">
    <survey-checkbox-item
      v-if="!question.hasColumns && question.blockedRow"
      v-for="(item, index) in question.dataChoices"
      :key="item.value"
      :class="question.getItemClass(item)"
      :question="question"
      :item="item"
      :index="index"
    ></survey-checkbox-item>
    </div>
    <div 
      v-if="question.hasColumns"
      :class="question.cssClasses.rootMultiColumn">

    <div
      
      v-for="(column, colIndex) in question.columns"
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
        <survey-checkbox-item
        v-for="(item, index) in question.footItems"
        v-if="question.hasFootItems"
        :key="item.value"
        :class="question.getItemClass(item)"
        :question="question"
        :item="item"
        :index="'' + index"
      ></survey-checkbox-item>
      <survey-other-choice
        v-if="
          question.renderedValue && question.isOtherSelected
        "
        :question="question"
      />
      </fieldset>
</template>

<script lang="ts">
import { QuestionCheckboxModel } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue],
  name: "survey-checkbox",
  props: {
    question: QuestionCheckboxModel,
    css: Object,
  }
});

</script>
