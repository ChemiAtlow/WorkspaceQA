<template>
    <top-bar />
    <div class="content">
        <transitioned-route :child="false" />
    </div>
    <teleport to="body">
        <transition-group name="fade">
            <backdrop v-if="loadingState || modalData.open" />
            <modal v-if="modalData.open && !loadingState" />
            <loader v-if="loadingState" fixed />
        </transition-group>
    </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TopBar from "@/components/TopBar/index.vue";
import Modal from "@/components/Modal/index.vue";
import Backdrop from "@/components/Backdrop/index.vue";
import TransitionedRoute from "@/components/TransitionedRoute/index.vue";

import { loadingState, modalData } from "./services/data.service";

const component = defineComponent({
    components: { TopBar, Modal, Backdrop, TransitionedRoute },
    setup() {
        return { loadingState, modalData };
    }
});

export default component;
</script>

<style lang="scss">
:root {
    //--background-color: #ecf0f3;
    --top-bar-height: 3.5rem;
    --white: white;
    --black: black;
}

* {
    box-sizing: border-box;
}

html,
body {
    height: 100vh;
    margin: 0;
    padding: 0;
}
.light {
    --background-color: #e8e8e8;
    --background-color-rgb: 232, 232, 232;
    --highlight-color: #5ca052;
    --highlighted-text-color: #fff;
    --bubble-color: #fff;
    --text-color: #000;
    --backdrop-color: rgba(0, 0, 0, 0.7);
    --top-bar-color: #5d5d5d;
    --danger-color: #750000;
}
.dark {
    --background-color: #000;
    --background-color-rgb: 0, 0, 0;
    --highlight-color: #7cbf75;
    --highlighted-text-color: #000;
    --bubble-color: #032528;
    --text-color: #fff;
    --backdrop-color: rgba(255, 255, 255, 0.6);
    --top-bar-color: #c1c1c1;
    --danger-color: #b10000;
}
body {
    background-color: var(--background-color, #edf0f2);
    font-family: "Assistant", sans-serif;
    text-align: center;
    color: var(--text-color, #fff);
    overflow: hidden;
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        letter-spacing: 4px;
    }
    .fade {
        &-enter-from,
        &-leave-to {
            opacity: 0;
            transform: scale(3);
        }
        &-enter-active,
        &-leave-active {
            transition: opacity 500ms ease, transform 350ms linear;
        }
    }
    .slide-right {
        &-enter-from,
        &-leave-to {
            position: absolute;
            opacity: 0;
            transform: translateX(-100%);
        }
        &-enter-active,
        &-leave-active {
            transition: opacity 300ms ease, transform 350ms linear;
        }
    }
    .slide-left {
        &-enter-from,
        &-leave-to {
            position: absolute;
            opacity: 0;
            transform: translateX(100%);
        }
        &-enter-active,
        &-leave-active {
            transition: opacity 300ms ease, transform 350ms linear;
        }
    }
    .open-menu {
        &-enter-from,
        &-leave-to {
            opacity: 0;
            transform: rotateX(90deg);
        }
        &-enter-active,
        &-leave-active {
            transition: all 340ms ease;
        }
    }
    #app {
        height: 100%;
        padding: 0.4rem;
        .content {
            height: calc(100% - var(--top-bar-height, 3.5rem));
        }
    }
}
</style>
