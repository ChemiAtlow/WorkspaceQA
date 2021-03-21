<template>
    <app-input v-model.trim="value" />
    <teleport to=".modal-buttons">
        <app-button :disabled="!isValid" @click="createProject">
            Create
        </app-button>
    </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { createNewProject } from "../../../services/projects.service";

const component = defineComponent({
    setup() {
        const value = ref("");
        const isValid = computed(() => value.value.length > 0);
        const createProject = async () => {
            if (!isValid.value) return;
            await createNewProject(value.value);
        };
        return { value, createProject, isValid };
    }
});

export default component;
</script>

<style lang="scss" scoped></style>
