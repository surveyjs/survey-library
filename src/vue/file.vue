<template>
    <div>
        <input v-if="isEditMode" type="file" :id="question.inputId" @change="doChange"/>
        <div>
            <img v-show="question.previewValue" :src="previewSrc" :height="question.imageHeight" :width="question.imageWidth"/>
        </div>
    </div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionFileModel} from '../question_file'

    @Component
    export default class File extends Question<QuestionFileModel> {
        previewSrc = null

        mounted() {
            this.question.valueChangedCallback = this.onValueChanged;
        }
        beforeDestroy() {
            this.question.valueChangedCallback = undefined; // TODO: ensure this works
        }

        onValueChanged() {
            this.previewSrc = this.question.value;
        }

        doChange (e) {
            var src = e.target || e.srcElement;
            if (!window["FileReader"]) return;
            if (!src || !src.files || src.files.length < 1) return;
            this.question.loadFile(src.files[0]);
        }
    }
    Vue.component("survey-file", File)
</script>