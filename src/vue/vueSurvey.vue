<template>
    <!--<div>{{model.questions[0].name}}</div>-->
    <div>Model has no questions for while :(</div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import Component from 'vue-class-component'
    import {VueSurveyModel} from './vueSurveyModel'

    @Component({
        props: {
            json: Object
        }
    })
    export default class Survey extends Vue {
        json: Object;

        model: VueSurveyModel;
        constructor () {
            super();
            this.model = new VueSurveyModel(this.json);
        }
    }

</script>