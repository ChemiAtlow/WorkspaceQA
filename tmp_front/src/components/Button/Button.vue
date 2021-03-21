<template>
    <button
        :class="{ invert }"
        @click="clicked"
        :style="style"
        :disabled="disabled"
    >
        <slot />
    </button>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
export default defineComponent({
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        opacity: {
            required: false,
            type: Number,
            validator: (value: number) => {
                return typeof value === "number" && value >= 0 && value <= 1;
            }
        },
        color: {
            type: String,
            required: false
        },
        backgroundColor: {
            type: String,
            required: false
        },
        invert: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    emits: ["click"],
    setup(props, { emit }) {
        function clicked(e: Event) {
            emit("click", e);
        }
        const style = computed(() => {
            const res: { [key: string]: string | number } = {};
            if (props.opacity) {
                res["--opacity"] = props.opacity;
            }
            if (props.color) {
                res["--btnColor"] = `var(${props.color})`;
            }
            if (props.backgroundColor) {
                res["--btnBackgroundColor"] = `var(${props.backgroundColor})`;
            }
            return res;
        });
        return { clicked, style };
    }
});
</script>

<style lang="scss" scoped>
button {
    outline: none;
    color: var(--btnColor, var(--highlighted-text-color, #fff));
    background: var(--btnBackgroundColor, var(--highlight-color, #5ca052));
    border: 2px solid var(--btnBackgroundColor, var(--highlight-color, #5ca052));
    border-radius: 0.4rem;
    padding: 0.4rem 0.8rem;
    font: inherit;
    font-size: 1.4rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 250ms linear;
    opacity: var(--opacity, 1);
    box-shadow: 0 0 0 0 var(--black, #000);
    &.invert {
        background: transparent;
        color: var(--btnBackgroundColor, var(--highlight-color, #5ca052));
    }
    &:hover,
    &:active,
    &:focus {
        &:not(:disabled) {
            //background: rgba(var(--background-color-rgb), 0.7);
            //color: var(--btnBackgroundColor, var(--highlight-color, #5ca052));
            box-shadow: 0.15rem 0.15rem 0.6rem var(--black, #000);
        }
    }
    &:disabled {
        opacity: 0.6;
        cursor: default;
    }
}
</style>
