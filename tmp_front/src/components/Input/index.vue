<template>
    <input @input="changeValue($event)" :value="modelValue" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

const component = defineComponent({
    props: {
        modelValue: String
    },
    setup(_, { emit }) {
        function changeValue(e: Event) {
            const value = (e.target as HTMLInputElement).value;
            emit("update:modelValue", value);
        }
        return { changeValue };
    }
});

export default component;
</script>

<style lang="scss" scoped>
input {
    background: rgba(var(--background-color-rgb), 0.3);
    outline: none;
    border: none;
    border-bottom: 3px solid var(--background-color);
    color: var(--text-color);
    width: 100%;
    font-size: 1.6rem;
    padding: 0.8rem 0.4rem;
    &:focus,
    &:active {
        background: rgba(var(--background-color-rgb), 0.5);
    }
}
</style>
