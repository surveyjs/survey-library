<template>
    <div>{{model.questions[0].name}}</div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import Component from 'vue-class-component'

    @Component({
        props: {
            json: Object
        }
    })
    export class Survey extends Vue {
        json: Object;
        constructor () {
            super();
        }
    }
</script>