<template>
    <div class="grid__holder">
        <item v-for="item in items" :key="item._id" :item="item" />
        <app-button @click="addProject" :opacity="0.9">Add+</app-button>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import Item from "./Item.vue";
import { openModal, projectData, userData } from "../../services/data.service";

export default defineComponent({
    components: { Item },
    setup() {
        const route = useRoute();
        const items = computed(() => {
            if (route.name === "Home") return userData.projects;
            else if (route.name === "ProjectUsers") return projectData.users;
            else if (route.name === "ProjectQuestions")
                return projectData.questions;
        });
        const addProject = () => openModal({ type: "createProject" });
        return { addProject, items };
    }
});
</script>

<style lang="scss" scoped>
.grid__holder {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.65rem;
    justify-items: left;
    @media (min-width: 48rem) {
        grid-template-columns: 1fr 1fr;
    }
}
</style>
