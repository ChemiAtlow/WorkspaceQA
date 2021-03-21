<template>
    <div class="login__page">
        <h1>Workspace Q&A</h1>
        <h2>In order to continue please log in</h2>
        <git-button :clientId="clientId" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GitButton from "@/components/Github/Button.vue";
import { setCallbackRoute } from "../services/auth.service";

export default defineComponent({
    components: { GitButton },
    props: {
        nextUrl: {
            type: String,
            required: false,
            default: ""
        }
    },
    setup(props) {
        setCallbackRoute(props.nextUrl);
        const clientId = process.env.VUE_APP_GITHUB_APP_CLIENT_ID;
        return { clientId };
    }
});
</script>

<style lang="scss" scoped>
.login__page {
    height: calc(100% - var(--top-bar-height));
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h1,
    h2 {
        text-transform: uppercase;
        font-weight: lighter;
        margin: 0.3rem 0;
    }
}
</style>
