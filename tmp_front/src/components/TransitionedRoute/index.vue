<template>
    <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transitionName || 'slide-right'">
            <component :is="Component" :key="key" />
        </transition>
    </router-view>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";

const component = defineComponent({
    props: {
        child: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const route = useRoute();
        const key = computed(() => {
            if (props.child) {
                return route.meta.transitionNameChild;
            }
            return route.meta.transitionNameParent || route?.name?.toString?.();
        });
        return { key };
    }
});

export default component;
</script>

<style lang="scss" scoped></style>
