<template>
  <div class="sv-tagbox__item" :key="item.key">
    <div class="sv-tagbox__item-text">
      <survey-string :locString="item.locText" />
    </div>
    <div v-bind:class="question.cssClasses.cleanItemButton" v-on:click="removeItem">
      <sv-svg-icon
        v-bind:class="question.cssClasses.cleanItemButtonSvg"
        :iconName="question.cssClasses.cleanItemButtonIconId"
        :size="'auto'"
      ></sv-svg-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { BaseVue } from "../../base";
import { ItemValue, QuestionTagboxModel } from "survey-core";

export default defineComponent({
  props: {
    item: ItemValue,
    question: QuestionTagboxModel,
  },
  mixins: [BaseVue],
  name: "sv-tagbox-item",
  data: (vm: any) => {
    return {
      inputElement: undefined,
      getModel: () => {
        return vm.item;
      },
    };
  },
  methods: {
    removeItem(event: any) {
      this.question.dropdownListModel.deselectItem(this.item.value);
      event.stopPropagation();
  }
  },
});
</script>
