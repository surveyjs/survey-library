<template>
        <div class='sjs_sp_container'>
        <div>
            <canvas tabindex='0'></canvas>
        </div>
        <div class='sjs_sp_controls'>
            <button type='button' class='sjs_sp_clear' title='Clear'>✖</button>
        </div>
    </div>

</template>

<script lang="ts">
    import Vue from "vue"
    import {Component, Prop, Watch} from 'vue-property-decorator'
    import {default as QuestionVue} from './question'
    import { QuestionSignaturePadModel } from '../question_signaturepad'

    @Component
    export class SignaturePad extends QuestionVue<QuestionSignaturePadModel> {
    }
    Vue.component("survey-signaturepad", SignaturePad)
    export default SignaturePad;
</script>