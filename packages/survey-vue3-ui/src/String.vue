<template>
  <SurveyVueComponent
    :name="locString.renderAs"
    :locString="locString.renderAsData"
  />
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import type { LocalizableString } from "survey-core";
defineProps<{
  locString: LocalizableString;
}>();
</script>
