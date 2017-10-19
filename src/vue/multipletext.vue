<template>
    <table :class="question.cssClasses.root">
        <tr v-for="row in question.getRows()" :class="question.cssClasses.row">
            <template v-for="(item, index) in row">
                <td :class="question.cssClasses.itemTitle"><survey-string :locString="item.locTitle"/></td>
                <td>
                    <input v-if="!question.isReadOnly" :id="item.id" :class="question.cssClasses.itemValue" :type="item.inputType" :size="question.itemSize" :placeholder="item.placeHolder" :value="item.value" @change="change(item, $event)" v-bind:aria-label="question.locTitle.renderedHtml"/>
                    <div v-else :class="question.cssClasses.itemValue" :id="item.id" :size="question.itemSize">{{item.value}}</div>
                </td>
            </template>
        </tr>
    </table>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionMultipleTextModel} from '../question_multipletext'

    @Component
    export default class MultipleText extends Question<QuestionMultipleTextModel> {
        change(item, event) {
            item.value = event.target.value;
        }
    }
    Vue.component("survey-multipletext", MultipleText)
</script>
