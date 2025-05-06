<template>
  <slot v-if="!!props.disabled" />
  <div ref="root" class="sv-scroll__wrapper" v-else>
    <div
      class="sv-scroll__scroller sv-drag-target-skipped"
      @scroll="() => model.onScrollContainer()"
    >
      <div class="sv-scroll__container">
        <slot />
      </div>
    </div>
    <div class="sv-scroll__scrollbar" @scroll="() => model.onScrollScrollbar()">
      <div class="sv-scroll__scrollbar-sizer"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ScrollViewModel } from "survey-core";
import { onMounted, onUnmounted, ref } from "vue";
const props = defineProps<{ disabled: any, onInnerHeightChanged?: (hasScroll: boolean) => void }>();
const model = new ScrollViewModel();
model.onInnerHeightChanged = (hasScroll: boolean) => {
  if (props.onInnerHeightChanged) {
    props.onInnerHeightChanged(hasScroll);
  }
};

const root = ref<HTMLDivElement>();
onMounted(() => {
  model.setRootElement(root.value as HTMLDivElement);
});
onUnmounted(() => {
  model.setRootElement(undefined as any);
  model.unsubscribeRootElement();
});
</script>
