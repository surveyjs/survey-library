<template>
  <li
    tabindex="0"
    role="option"
    :aria-selected="model.isItemSelected(item)"
    v-show="model.isItemVisible(item)"
    :key="item.id"
    v-bind:class="model.getItemClass(item)"
    v-on:click="click"
    v-on:keyup="keyUp"
  >
    <div 
      v-if="item.needSeparator"
      v-bind:class="model.cssClasses.itemSeparator"
      />

    <div
      :style="{ paddingInlineStart: model.getItemIndent(item) }"
      v-bind:class="model.cssClasses.itemBody"
    >
      <sv-svg-icon
        v-if="item.iconName && !item.component"
        v-bind:class="model.cssClasses.itemIcon"
        :iconName="item.iconName"
        :size="24"
      ></sv-svg-icon>
      <survey-string v-if="!item.component" :locString="item.locTitle" />
      <component v-if="item.component" :is="item.component" :item="item"> </component>
    </div>
  </li>
</template>

<script lang="ts">
import { ListModel, Action } from "survey-core";
import { defineSurveyComponent } from "../../base";
import type { PropType } from "vue";

//todo
function attachKey2click(event: any) {

}
export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "sv-list-item",
  props: {
    model: Object as PropType<ListModel>,
    item: Object as PropType<Action>,
  },
  methods: {
    click(event: any) {
      this.model.onItemClick(this.item as any);
      event.stopPropagation();
    },
    keyup(event: any) {
      attachKey2click(event);
    }
  },
  data: (vm: any) => {
    return {
      getModel: () => {
        return vm.item;
      },
    };
  },
  mounted() {
    this.model.onLastItemRended(<any>this.item);
  },
});
</script>
