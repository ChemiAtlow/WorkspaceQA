<template>
    <div class="links">
        <router-link :to="users" active-class="active-page">
            Users
        </router-link>
        <router-link :to="questions" active-class="active-page">
            Questions
        </router-link>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

const component = defineComponent({
    setup() {
        const route = useRoute();
        const { projectId } = route.params;
        const users = { name: "ProjectUsers", params: { projectId } };
        const questions = { name: "ProjectQuestions", params: { projectId } };
        return { users, questions };
    }
});

export default component;
</script>

<style lang="scss" scoped>
.links {
    margin-bottom: 1.5rem;
    text-align: start;
    a {
        font-size: 1.3rem;
        text-decoration: none;
        color: var(--text-color);
        transition: border 400ms linear;
        &.active-page,
        &:hover,
        &:active,
        &:focus {
            color: var(--highlight-color);
            border-bottom: 6px solid var(--highlight-color);
        }
        &:not(:last-of-type) {
            margin-right: 1rem;
        }
    }
}
</style>
