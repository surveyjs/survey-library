<template>
    <div>
        <div :class="css.rating.root">
            <label v-for="(item, index) in question.visibleRateValues" :class="getCss(item)">
                <input type="radio" style="display: none;" :name="question.name" :id="question.name + index" :value="item.value" :disabled="!isEditMode" @change="change" />
                <span v-if="index === 0">{{question.minRateDescription}}</span>
                <span>{{item.text}}</span>
                <span v-if="index === question.visibleRateValues.length-1">{{question.maxRateDescription}}</span>
            </label>
        </div>
        <survey-other-choice v-show="question.hasOther" :class="css.rating.other" :question="question" :isEditMode="isEditMode" :css="css"/>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionRatingModel} from '../question_rating'

    @Component
    export default class Rating extends Question<QuestionRatingModel> {
        selection = ''
        getCss(item) {
            let css = this.css.rating.item;
            if (this.selection == item.value || this.question.value == item.value) {
                css = css + " active";
            }
            return css;
        }
        change(e) {
            this.selection = this.question.value = e.target.value;
        }
    }
    Vue.component("survey-rating", Rating)
</script>