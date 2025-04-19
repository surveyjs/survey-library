<template>
    <div v-if="!summary.isEmpty()" :class="css.summary">
      <div v-for="(item, index) in summary.items" :key="index" :class="css.summaryRow">
        <div :class="css.summaryRowContent">
          <SvComponent :is="'survey-string'" :locString="item.locText" />
        </div>
        <div :class="css.summaryRowActions">
          <button
            v-if="item.btnEdit"
            :class="css.summaryRowActionEdit"
            @click="item.btnEdit.action()"
            :title="item.btnEdit.title"
          >
            <SvComponent :is="'sv-svg-icon'" iconName="icon-editsmall-16x16" size="auto" />
          </button>
          <button
            v-if="item.showRemove && item.btnRemove"
            :class="css.summaryRowActionDelete"
            @click="item.btnRemove.action()"
            :title="item.btnRemove.title"
          >
            <SvComponent :is="'sv-svg-icon'" iconName="icon-delete-16x16" size="auto" />
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <SvComponent
        v-if="componentRegistered"
        :is="'survey-placeholder-' + summary.question.getTemplate()"
        :cssClasses="css"
        :question="summary.question"
      />
      <div v-else>
        <SvComponent :is="'survey-string'" :locString="summary.noEntry" />
      </div>
    </div>
</template>

<script lang="ts" setup>
import { QuestionSingleInputSummary } from "survey-core";
import SvComponent from "@/SvComponent.vue";
import { computed } from "vue";
import { ComponentFactory } from "@/component-factory";

const props = defineProps<{
  summary: QuestionSingleInputSummary;
  css: any;
}>();

const placeholderComponent = computed(()=>"survey-placeholder-" + props.summary.question.getTemplate())
const componentRegistered = computed(()=> ComponentFactory.Instance.isComponentRegistered(placeholderComponent.value))

</script>