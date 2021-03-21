<template>
    <ul class="selector">
        <li @click="switchTheme('light')">
            Light
            <div class="dot light"></div>
        </li>
        <li @click="switchTheme('dark')">
            Dark
            <div class="dot dark"></div>
        </li>
    </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const component = defineComponent({
    props: {
        switchTheme: {
            type: Function,
            required: true
        }
    }
});

export default component;
</script>

<style lang="scss" scoped>
.selector {
    background-color: var(--bubble-color);
    padding: 0;
    margin: 0;
    width: 6rem;
    height: auto;
    border-radius: 0.6rem;
    list-style: none;
    position: absolute;
    display: grid;
    top: 2rem;
    overflow: hidden;
    box-shadow: 0 0 1rem 0.25rem var(--text-color);
    li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.6rem;
        cursor: pointer;
        .dot {
            height: 1.5rem;
            width: 1.5rem;
            border-radius: 50%;
            background-color: var(--background-color);
            box-shadow: 0px 0px 0.2rem 0.02rem var(--highlight-color);
            margin: 0 0.2rem;
        }
        &:hover {
            background-color: var(--background-color);
        }
    }
}
</style>
