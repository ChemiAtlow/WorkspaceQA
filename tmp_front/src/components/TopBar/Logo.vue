<template>
    <div class="logo" @click="clicked">
        <div class="logo__dot logo__dot-1"></div>
        <div class="logo__dot logo__dot-2"></div>
        <div class="logo__dot logo__dot-3"></div>
        <div class="logo__dot logo__dot-4"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    setup(_, { emit }) {
        const clicked = (e: Event) => emit("click", e);
        return { clicked };
    }
});
</script>

<style lang="scss" scoped>
.logo {
    display: flex;
    margin-left: 1.8rem;
    cursor: pointer;
    &__dot {
        height: 1.5rem;
        width: 1.5rem;
        border-radius: 50%;
        &-1 {
            background-color: var(--background-color);
        }
        &-2 {
            background-color: var(--bubble-color);
        }
        &-3 {
            background-color: var(--highlight-color);
        }
        &-4 {
            background-color: var(--text-color);
        }
    }
}
</style>
