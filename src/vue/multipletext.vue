<template>
    <table :class="css.multipletext.root">
        <tr v-for="row in question.getRows()">
            <template v-for="(item, index) in row">
                <td :class="css.multipletext.itemTitle">{{item.fullTitle}}</td>
                <td>
                    <input type="text" v-if="isEditMode" :class="css.multipletext.itemValue" v-model="item.value" :size="question.itemSize" :placeholder="item.placeHolder" :id="index === 0 ? question.inputId : ''" style="float:left" />
                    <div v-else style="float:left" :class="css.multipletext.itemValue" :size="question.itemSize">{{item.value}}</div>
                </td>
            <template>
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
    }
    Vue.component("survey-multipletext", MultipleText)
</script>