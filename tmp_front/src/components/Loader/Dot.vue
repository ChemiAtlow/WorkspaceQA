<template>
    <div
        class="loader__dot"
        :class="`loader__dot-${className}`"
        :style="cssVars"
    ></div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

const component = defineComponent({
    props: {
        index: {
            type: Number,
            default: 0
        }
    },
    setup(props) {
        const className = computed(() => {
            if (props.index == 0) return "zero";
            else if (props.index == 1) return "one";
            else if (props.index == 2) return "two";
            else return "three";
        });
        const cssVars = computed(() => ({
            "--index": props.index
        }));
        return { className, cssVars };
    }
});

export default component;
</script>

<style lang="scss" scoped>
.loader__dot {
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
    animation: 650ms blink infinite alternate calc(325ms * var(--index, 1));
    &-zero {
        grid-area: zero;
        background-color: var(--background-color);
    }
    &-one {
        grid-area: one;
        background-color: var(--bubble-color);
    }
    &-two {
        grid-area: two;
        background-color: var(--highlight-color);
    }
    &-three {
        grid-area: three;
        background-color: var(--text-color);
    }
    @keyframes blink {
        0% {
            transform: scale(0.8);
        }
        50% {
            transform: scale(1.3);
        }
        100% {
            transform: scale(1.3);
        }
    }
}
</style>
