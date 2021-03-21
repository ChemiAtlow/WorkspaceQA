<template>
    <div :class="{ 'loader-fixed': fixed }">
        <p v-if="fixed" class="loader-fixed__text">Loading...</p>
        <div class="loader">
            <dot :index="0" />
            <dot :index="1" />
            <dot :index="2" />
            <dot :index="3" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Dot from "./Dot.vue";

const component = defineComponent({
    components: { Dot },
    props: {
        fixed: Boolean
    }
});

export default component;
</script>

<style lang="scss" scoped>
.loader {
    display: grid;
    grid-template: "zero one" "two three";
    justify-content: center;
    align-content: center;
    animation: 1.3s pump infinite, 10.4s rotating infinite;
    @keyframes pump {
        0% {
            gap: 0.8rem 0.8rem;
        }
        70% {
            gap: 1.9rem 1.9rem;
        }
        100% {
            gap: 0.8rem 0.8rem;
        }
    }
    @keyframes rotating {
        0%,
        15% {
            transform: rotateZ(45deg);
        }
        25%,
        40% {
            transform: rotateZ(315deg);
        }
        50%,
        65% {
            transform: rotateZ(585deg);
        }
        75%,
        90% {
            transform: rotateZ(855deg);
        }
        100% {
            transform: rotateZ(1125deg);
        }
    }
    &-fixed {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        display: flex;
        justify-content: center;
        z-index: 30;
        & &__text {
            font-size: 3rem;
            color: var(--bubble-color);
            position: absolute;
            top: 5rem;
            right: 50%;
            transform: translateX(50%);
        }
    }
}
</style>
