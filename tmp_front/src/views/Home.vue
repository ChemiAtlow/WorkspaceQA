<template>
    <div class="grid__dad">
        <div class="title">
            <h1>
                {{ title }}
                <span class="title__count"> ({{ count }})</span>
            </h1>
            <trash v-if="canDelete" @click="deleteProj" />
        </div>
        <links v-if="route.name !== 'Home'" />
        <component :is="toShow" v-bind="boundParams" />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from "vue";
import { useRoute } from "vue-router";

import Empty from "../components/GridPage/Empty/Empty.vue";
import Links from "../components/GridPage/Links.vue";
import GridHolder from "../components/GridPage/GridHolder.vue";
import Trash from "../components/Icons/Trash.vue";
import TransitionedRoute from "@/components/TransitionedRoute/index.vue";

import {
    loadingState,
    openModal,
    projectData,
    userData
} from "../services/data.service";
import { getAllProjects, getAProject } from "../services/projects.service";

export default defineComponent({
    components: { Empty, Links, GridHolder, Trash, TransitionedRoute },
    setup() {
        const route = useRoute();
        const title = computed(() => {
            return route.name === "Home"
                ? "Your Projects"
                : `Project "${
                      projectData.name
                  }" - ${(route.name as string).replace("Project", "")}`;
        });
        const count = computed(() => {
            if (route.name === "Home") return userData.projects?.length;
            else if (route.name === "ProjectUsers")
                return projectData.users?.length;
            else if (route.name === "ProjectQuestions")
                return projectData.questions?.length;
        });
        const toShow = computed(() => {
            if (route.name === "Home") return "GridHolder";
            else if (userData.projects?.length) return "TransitionedRoute";
            else if (!loadingState) return "empty";
        });
        const boundParams = computed(() => {
            if (route.name !== "Home" && userData.projects?.length) {
                return { child: true };
            }
            return {};
        });
        const canDelete = computed(
            () => route.name !== "Home" && projectData.owner === userData._id
        );
        const deleteProj = () => openModal({ type: "DeleteWarning" });
        getAllProjects();
        watch(
            () => route.params.projectId,
            value => value && getAProject(value as string)
        );
        return {
            route,
            title,
            count,
            toShow,
            canDelete,
            deleteProj,
            boundParams
        };
    }
});
</script>

<style lang="scss" scoped>
.grid__dad {
    width: 95%;
    max-width: 90rem;
    margin: 0 auto;
    .title {
        display: flex;
        margin: 0.5rem 0;
        align-items: center;
        justify-content: space-between;
        h1 {
            margin: 0;
            font-weight: 200;
            font-size: 2rem;
            text-transform: uppercase;
        }
        &__count {
            font-size: 1.4rem;
            color: var(--highlight-color);
        }
        //text-align: left;
        @media (min-height: 33rem) {
            margin-top: 4rem;
        }
    }
}
</style>
