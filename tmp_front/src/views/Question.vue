<template>
    <div class="qa_pane">
        <p>Question</p>
        <p>Answer</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const component = defineComponent({});

export default component;
</script>

<style lang="scss" scoped>
.qa_pane {
    display: grid;
    grid-template-columns: 0.45fr 0.55fr;
    height: 100%;
}
</style>
