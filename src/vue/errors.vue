<template>
    <div role="alert" v-show="!!question.errors && question.errors.length > 0" :class="question.cssClasses ? question.cssClasses.error.root : 'panel-error-root'">
        <div v-for="error in question.errors">
            <span :class="question.cssClasses ? question.cssClasses.error.icon : 'panel-error-icon'" aria-hidden="true"></span>
            <span :class="question.cssClasses ? question.cssClasses.error.item : 'panel-error-item'"><survey-string :locString="error.locText"/></span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question } from "../question";

@Component
export class Errors extends Vue {
  @Prop question: Question;
}
Vue.component("survey-errors", Errors);
export default Errors;
</script>
