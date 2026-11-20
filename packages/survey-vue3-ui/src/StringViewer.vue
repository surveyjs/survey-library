<template>
  <span
    :class="className"
    v-if="hasHtml"
    v-html="renderedHtml"
  ></span>
  <span :class="className" v-else>{{ renderedHtml }}</span>
</template>

<script lang="ts" setup>
import type { LocalizableString } from "survey-core";
import { onBeforeUnmount, ref, watch } from "vue";
import { useLocString } from "./base";
const props = defineProps<{
  model: LocalizableString;
  textClass?: string;
}>();
const renderedHtml = useLocString(() => props.model);
// hasHtml can flip while the rendered text stays the same string, so the text ref alone
// does not re-render this view.
const hasHtml = ref(false);
const syncHtml = (locString: LocalizableString): void => {
  hasHtml.value = !!locString && locString.hasHtml;
};
const stopWatch = watch(
  () => props.model,
  (value, oldValue) => {
    if (oldValue) oldValue.onStringChanged.remove(syncHtml);
    if (value) {
      value.onStringChanged.add(syncHtml);
      syncHtml(value);
    }
  },
  { immediate: true }
);
onBeforeUnmount(() => {
  props.model?.onStringChanged.remove(syncHtml);
  stopWatch();
});
const className = props.model.getStringViewerClassName(props.textClass);
</script>
