<template>
    <teleport to=".modal-title">
        <img :src="avatar" alt="Image" />
    </teleport>
    <p>Name: {{ name }}</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const component = defineComponent({
    props: {
        name: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        }
    }
});

export default component;
</script>

<style lang="scss" scoped>
img {
    border-radius: 0.4rem;
    height: 8rem;
    grid-area: img;
    margin-bottom: 1rem;
}
p {
    font-size: 1.3rem;
    margin: 0;
}
</style>
