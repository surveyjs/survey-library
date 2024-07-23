<template>
  <div class="sd-rating-dropdown-item">
    <span class="sd-rating-dropdown-item_text">{{ item.title }}</span>
    <div v-if="!!item.description" class="sd-rating-dropdown-item_description">
      <SurveyVueComponent :name="'survey-string'" :locString="item.description" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import { useBase } from "@/base";

const props = defineProps<{ item: any }>();

useBase(() => props.item);
</script>
