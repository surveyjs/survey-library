<template>
    <div>
        <input v-if="!question.isReadOnly" type="file" :id="question.inputId" @change="doChange"/>
        <div>
            <img v-show="question.previewValue" :src="question.value" :height="question.imageHeight" :width="question.imageWidth"/>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionFileModel} from '../question_file'

    @Component
    export default class File extends Question<QuestionFileModel> {
        doChange (e) {
            var src = e.target || e.srcElement;
            if (!window["FileReader"]) return;
            if (!src || !src.files || src.files.length < 1) return;
            this.question.loadFile(src.files[0]);
        }
    }
    Vue.component("survey-file", File)
</script>
