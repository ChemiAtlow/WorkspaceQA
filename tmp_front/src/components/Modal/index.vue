<template>
    <div class="modal">
        <div class="modal-title" :class="{ warning }">
            <h1>{{ modalData.title }}</h1>
        </div>
        <div class="content">
            <component
                v-if="isMounted"
                :is="component.componentTag"
                v-bind="{ ...component.props }"
            />
        </div>
        <div class="modal-buttons">
            <app-button @click="closeModal" invert class="light"
                >Close</app-button
            >
        </div>
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineAsyncComponent,
    defineComponent,
    onUnmounted,
    onMounted,
    ref
} from "vue";
import { closeModal, modalData } from "../../services/data.service";

const isMounted = ref(false);

export default defineComponent({
    components: {
        CreateProject: defineAsyncComponent(() =>
            import("./CreateProject/index.vue")
        ),
        User: defineAsyncComponent(() => import("./User/index.vue")),
        DeleteWarning: defineAsyncComponent(() =>
            import("./DeleteWarning/index.vue")
        ),
        Info: defineAsyncComponent(() => import("./Info/index.vue"))
    },
    setup() {
        onMounted(() => {
            isMounted.value = true;
        });
        onUnmounted(() => {
            isMounted.value = false;
        });
        const component = computed(() => {
            if (modalData.type === "createProject") {
                return {
                    componentTag: "create-project"
                };
            } else if (modalData.type === "userProfile") {
                return {
                    componentTag: "user",
                    props: {
                        ...(modalData.message as object)
                    }
                };
            } else if (modalData.type === "DeleteWarning") {
                return {
                    componentTag: "delete-warning",
                    props: { name: modalData.message }
                };
            }
            return {
                componentTag: "info",
                props: { message: modalData.message }
            };
        });
        const warning = computed(
            () =>
                modalData.type === "error" || modalData.type === "DeleteWarning"
        );
        return { modalData, closeModal, component, isMounted, warning };
    }
});
</script>

<style lang="scss" scoped>
.modal {
    //background: var(--background-color);
    position: fixed;
    color: var(--highlighted-text-color, #fff);
    top: 10%;
    right: 10%;
    width: 80%;
    max-height: 80%;
    border-radius: 1rem;
    padding: 0.6rem;
    display: grid;
    grid-template-rows: auto 1fr auto;
    row-gap: 1rem;
    z-index: 30;
    @media (min-height: 40rem) {
        max-height: 25rem;
    }
    .modal-title {
        display: grid;
        justify-content: start;
        align-items: center;
        grid-template-areas: "img" "title";
        &.warning h1 {
            background: var(--danger-color);
            padding: 0 0.8rem;
        }
        h1 {
            margin: 0;
            font-weight: lighter;
            text-transform: uppercase;
            font-size: 2.4rem;
        }
    }
    .content {
        overflow-y: auto;
        text-align: left;
    }
    .modal-buttons {
        display: grid;
        grid-auto-flow: column;
        justify-content: start;
        column-gap: 0.6rem;
        ::v-deep button {
            padding: 0.1rem 0.8rem;
        }
    }
}
</style>
