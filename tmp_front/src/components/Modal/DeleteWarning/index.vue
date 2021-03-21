<template>
    <p>Are you sure you want to remove "{{ name }}"?</p>
    <p>This action will affect all users and all questions.</p>
    <teleport to=".modal-buttons">
        <app-button
            @click="deleteProject"
            background-color="--white"
            color="--danger-color"
        >
            Delete
        </app-button>
    </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { projectData } from "../../../services/data.service";
import { deleteAProject } from "../../../services/projects.service";

const component = defineComponent({
    props: {
        name: {
            type: String,
            required: true
        }
    },
    setup() {
        const deleteProject = async () => {
            await deleteAProject(projectData._id as string);
        };
        return { deleteProject };
    }
});

export default component;
</script>

<style lang="scss" scoped>
p {
    font-size: 1.4rem;
    margin: 0.1rem 0;
}
</style>
