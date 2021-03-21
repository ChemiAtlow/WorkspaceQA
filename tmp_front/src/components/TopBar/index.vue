<template>
    <div class="topbar">
        <logo @click="goHome" />
        <h2>Workspace Q&A</h2>
        <theme-selector />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import Logo from "./Logo.vue";
import ThemeSelector from "./ThemeSelector/index.vue";

export default defineComponent({
    components: { Logo, ThemeSelector },
    setup() {
        const router = useRouter();
        const goHome = () => router.push("/");
        return { goHome };
    }
});
</script>

<style lang="scss" scoped>
.topbar {
    height: var(--top-bar-height, 3.5rem);
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    margin: -0.4rem;
    margin-bottom: 0.4rem;
    background: var(--top-bar-color, #5d5d5d);
    h2 {
        text-transform: uppercase;
        color: var(--highlighted-text-color);
        font-weight: 200;
        margin: 0;
        margin-left: 0.8rem;
        line-height: 1;
        font-size: 1.3rem;
    }
}
</style>
