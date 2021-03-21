<template>
    <button class="btn" @click="goToGitHub">
        <git-logo />
        <p>Github</p>
    </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GitLogo from "../Icons/Github.vue";

export default defineComponent({
    props: {
        clientId: {
            type: String,
            required: true
        }
    },
    components: { GitLogo },
    setup(props) {
        function goToGitHub() {
            window.location.href = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${props.clientId}`;
        }
        return { goToGitHub };
    }
});
</script>

<style lang="scss" scoped>
.btn {
    margin: 1rem;
    padding: 0;
    height: 64px;
    width: calc(min(28rem, 95%));
    outline: none;
    color: var(--text-color, #000);
    background-color: var(--bubble-color, #fff);
    border: 1px solid var(--background-color, #d7d7d7);
    border-radius: 0.6rem;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    flex: initial;
    font-size: 1.4rem;
    font-weight: 900;
    transition: all 300ms linear;
    p {
        text-align: center;
        flex: 1;
        margin: 0;
        align-items: center;
        justify-content: center;
        border-left: 1px solid;
        display: flex;
        border-color: inherit;
        align-self: stretch;
    }
    &:hover {
        background-color: var(--background-color, #d7d7d7);
        border: 1px solid var(--text-color, #000);
    }
}
</style>
