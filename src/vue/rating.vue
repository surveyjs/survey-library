<template>
    <div>
        <div :class="css.rating.root">
            <label v-for="(item, index) in question.visibleRateValues" :class="getCss(item)">
                <input type="radio" style="display: none;" :name="question.name" :id="question.name + index" :value="item.value" :disabled="!isEditMode" @change="change" />
                <span v-show="index === 0">{{question.mininumRateDescription}}</span>
                <span>{{item.text}}</span>
                <span v-show="index === question.visibleRateValues.length-1">{{question.maximumRateDescription}}</span>
            </label>
        </div>
        <survey-other-choice v-show="question.hasOther" :class="css.rating.other" :question="question" :isEditMode="isEditMode" :css="css"/>
    </div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionRatingModel} from '../question_rating'

    @Component
    export default class Rating extends Question<QuestionRatingModel> {
        getCss(val) {
            var ratingCss = this.css.rating.item;
            return this.question.value == val.value ? ratingCss + " active" : ratingCss;
        }
        change(val) {
            this.question.value = val.target.value;
        }
    }
    Vue.component("survey-rating", Rating)
</script>