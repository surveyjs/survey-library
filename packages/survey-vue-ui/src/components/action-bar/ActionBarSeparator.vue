<template>
  <div class="sv-action-bar-separator" :class="innerCss"></div>
</template>

<script lang="ts">
import { Action } from "survey-core";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "sv-action-bar-separator",
  props: {
    item: Action,
  },
  computed: {
    innerCss() {
      return this.item && this.item.innerCss;
    },
  },
  data: (vm: any) => {
    return {
      getModel: () => {
        return vm.question;
      },
    };
  },
});

</script>
