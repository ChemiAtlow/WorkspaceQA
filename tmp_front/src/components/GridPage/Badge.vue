<template>
    <div :class="`badge badge__${data[0]}`">
        <span class="title">{{ data[1] }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { BadgeModel } from "../../models/badge.model";

export default defineComponent({
    props: {
        data: {
            type: (Array as unknown) as () => BadgeModel,
            required: true
        }
    }
});
</script>
<style lang="scss" scoped>
.badge {
    border-radius: 4px;
    padding: 0.2rem 0.5rem;
    &__highlight {
        background-color: var(--highlight-color);
        color: var(--highlighted-text-color);
    }
    &__invert {
        border: 1px solid var(--highlight-color);
        color: var(--highlight-color);
    }
}
</style>
