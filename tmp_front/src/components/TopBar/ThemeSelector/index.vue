<template>
    <div class="theme-selector">
        <icon @click.stop="toggleByClick" @mouseenter="toggleByHover" />
        <transition name="open-menu">
            <selector
                v-if="showSelector"
                v-click-out-of="() => (showSelector = false)"
                @mouseleave="toggleByHover"
                :switch-theme="switchTheme"
            />
        </transition>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Selector from "./Selector.vue";
import Icon from "../../Icons/ThemeSelector.vue";

export default defineComponent({
    components: { Selector, Icon },
    setup(_, { emit }) {
        const clicked = (e: Event) => emit("click", e);
        const showSelector = ref(false);
        const hovered = ref(false);
        const toggleByHover = () => {
            if (showSelector.value && hovered.value) {
                showSelector.value = false;
                hovered.value = false;
            } else if (!showSelector.value) {
                showSelector.value = true;
                hovered.value = true;
            }
        };
        const toggleByClick = () => {
            if (showSelector.value) {
                if (!hovered.value) {
                    showSelector.value = false;
                }
                hovered.value = false;
            } else if (!showSelector.value) {
                showSelector.value = true;
                hovered.value = false;
            }
        };
        const switchTheme = (to: "light" | "dark") => {
            showSelector.value = false;
            document.body.classList.remove("light", "dark");
            document.body.classList.add(to);
        };
        return {
            clicked,
            showSelector,
            switchTheme,
            toggleByHover,
            toggleByClick
        };
    }
});
</script>

<style lang="scss" scoped>
.theme-selector {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 0.8rem;
    position: relative;
    height: 100%;
}
</style>
