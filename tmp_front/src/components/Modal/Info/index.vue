<template>
    <p>{{ message }}</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const component = defineComponent({
    props: {
        message: {
            type: String,
            required: true
        }
    }
});

export default component;
</script>

<style lang="scss" scoped></style>
