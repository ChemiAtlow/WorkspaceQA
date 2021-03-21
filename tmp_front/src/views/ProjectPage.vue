<template>
    <grid-page :title="projectData.name" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";

import GridPage from "../components/GridPage/index.vue";
import { projectData, userData } from "../services/data.service";
import { getAProject } from "../services/projects.service";

export default defineComponent({
    components: { GridPage },
    setup() {
        const route = useRoute();
        const { projectId } = route.params;
        getAProject(projectId as string);
        onBeforeRouteUpdate(to => {
            const { projectId } = to.params;
            getAProject(projectId as string);
        });
        return { userData, projectData };
    }
});
</script>
