<template>
  <div :class="this.getСssClass()">
    <div style="clear: both" :class="this.getСssClass()">
      <div :class="question.cssClasses.progressContainer">
          <sv-paneldynamic-prev-btn :data="{ question: question }" />
        <div :class="question.cssClasses.progress" v-if="question.isRangeShowing">
          <div
            :class="question.cssClasses.progressBar"
            :style="{ width: question.progress }"
            role="progressbar"
          ></div>
        </div>
          <sv-paneldynamic-next-btn :data="{ question: question }" />
      </div>
      <sv-paneldynamic-add-btn :data="{ question: question }" />
      <sv-paneldynamic-progress-text :data="{ question: question }" />
    </div>
  </div>
</template>

<script lang="ts">
import { QuestionPanelDynamicModel } from "survey-core";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-paneldynamicprogress",
  props: {
    question: QuestionPanelDynamicModel,
  },
  data: (vm: any) => {
    return {
      getСssClass() {
        return vm.question.isProgressTopShowing
          ? vm.question.cssClasses.progressTop
          : vm.question.cssClasses.progressBottom;
      },
    };
  },
});
</script>
