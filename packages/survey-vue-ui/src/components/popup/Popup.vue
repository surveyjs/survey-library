<template>
  <div><sv-popup-container :model="popupViewModel"></sv-popup-container></div>
</template>
<script lang="ts">
import { BaseVue } from "@/base";
import { PopupModel, createPopupViewModel } from "survey-core";
import { type PropType, shallowRef, defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "sv-popup",
  props: {
    model: { type: Object as PropType<PopupModel>, required: true },
    getTarget: { type: Function, required: false },
  },
  mixins: [BaseVue],
  setup(props) {
    return {
      popupViewModel: shallowRef(createPopupViewModel(props.model, undefined as any)),
    };
  },
  mounted() {
    const container = (this.$el as HTMLElement) as HTMLElement;
    this.popupViewModel.setComponentElement(
      container,
      this.getTarget ? this.getTarget(container) : undefined
    );
  },
  unmounted() {
    this.popupViewModel.dispose();
  },
  methods: {
    getModel() {
      return this.model;
    },
  },
  watch: {
    model(newValue: PopupModel) {
      this.popupViewModel.dispose();
      this.popupViewModel = createPopupViewModel(newValue, undefined as any);
      this.popupViewModel = this.$el.parentElement;
    },
  },
});
</script>
