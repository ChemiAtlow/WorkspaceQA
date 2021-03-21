<template>
    <p :class="sign">{{ text }}{{ Math.abs(rank) }}</p>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

const component = defineComponent({
    props: {
        rank: {
            type: Number,
            required: true
        }
    },
    setup(props) {
        const sign = computed(() =>
            props.rank > 0 ? "positive" : props.rank < 0 ? "negative" : null
        );
        const text = computed(() =>
            props.rank > 0 ? "+" : props.rank < 0 ? "-" : undefined
        );
        return { text, sign };
    }
});

export default component;
</script>

<style lang="scss" scoped>
p {
    margin: 0;
    padding: 0 0.5rem;
    font-size: 1rem;
    background: var(--background-color);
    border-radius: 4px;
    display: flex;
    align-items: center;
    margin-left: 0.3rem;
    &.positive {
        color: var(--highlight-color);
    }
    &.negative {
        color: var(--danger-color);
    }
}
</style>
