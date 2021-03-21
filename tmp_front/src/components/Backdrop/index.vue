<template>
    <div class="backdrop"></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onUnmounted } from "vue";

const component = defineComponent({
    setup() {
        const app = document.body.querySelector("#app");
        onBeforeMount(() => {
            if (app) app.classList.add("backdrop-opened");
        });
        onUnmounted(() => {
            if (app) app.classList.remove("backdrop-opened");
        });
    }
});

export default component;
</script>

<style lang="scss" scoped>
.backdrop {
    background: var(--backdrop-color);
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 20;
    backdrop-filter: blur(6px);
}
</style>
