<template>
    <div class="empty-view">
        <sad />
        <div class="data">
            <h1 class="title">
                {{
                    type === "Projects"
                        ? "You currently are not connected to any project."
                        : "There are no questions here yet :/"
                }}
            </h1>
            <app-button @click="addProj" v-if="type === 'Projects'">
                Click here to create one
            </app-button>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import { openModal } from "../../../services/data.service";
import Sad from "../../Icons/Sad.vue";

export default defineComponent({
    components: { Sad },
    setup() {
        const route = useRoute();
        const type = computed(() => {
            if (route.name === "projectPage") return "Projects";
            else if (route.name === "ProjectQuestions") return "Questions";
        });
        const addProj = () => openModal({ type: "createProject" });
        return { addProj, type };
    }
});
</script>

<style lang="scss" scoped>
.empty-view {
    display: flex;
    align-items: center;
    justify-content: center;
    .data {
        margin-left: 1rem;
    }
    .title {
        font-weight: 200;
        font-size: 2rem;
        margin: 0 0 1rem;
    }
    @media (min-height: 40rem) {
        flex-flow: column nowrap;
        .data {
            margin-left: 0;
            margin-top: 1rem;
        }
    }
}
</style>
