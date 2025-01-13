<template>
  <label
    role="radio"
    :class="model.css.label"
    :title="model.caption.renderedHtml"
  >
    <input
      type="radio"
      :name="model.name"
      :id="model.id"
      :aria-required="model.isRequired"
      :aria-label="model.caption.renderedHtml"
      role="radio"
      :aria-invalid="model.hasErrors"
      :aria-errormessage="model.describedBy"
      :disabled="model.readOnly"
      :class="model.css.control"
      v-model="renderedValue"
      :value="model.value"
    />
    <div :class="model.css.decorator">
      <SvComponent
        :is="'sv-svg-icon'"
        v-if="model.iconName"
        :iconName="model.iconName"
        :size="model.iconSize"
        :class="model.css.icon"
      ></SvComponent>
      <span
        :class="model.css.caption"
        v-if="model.showCaption"
        :title="model.caption.renderedHtml"
      >
        <SvComponent
          :is="'survey-string'"
          :locString="model.caption"
        ></SvComponent>
      </span>
    </div>
  </label>
</template>
<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import {
  ButtonGroupItemModel,
  QuestionButtonGroupModel,
  type ItemValue,
} from "survey-core";
import { computed } from "vue";

const props = defineProps<{
  item: ItemValue;
  question: QuestionButtonGroupModel;
  index: number;
}>();
const model = computed(
  () => new ButtonGroupItemModel(props.question, props.item, props.index)
);
const renderedValue = computed({
  get: () => props.question.renderedValue,
  set: (val) => {
    const question = props.question;
    question.renderedValue = val;
  },
});
</script>
