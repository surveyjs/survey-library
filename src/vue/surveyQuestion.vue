<template>
    <div>
    Question
    </div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import Component from 'vue-class-component'
    import {surveyCss} from "../defaultCss/cssstandard"

    @Component({
        props: {
        }
    })
    export default class SurveyQuestion extends Vue {
        constructor () {
            super();
        }
    }
</script>