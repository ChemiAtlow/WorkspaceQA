<template>
    <div class="item" @click="goTo">
        <span class="title">{{
            item.username || item.name || item.title
        }}</span>
        <badge :data="badgeData" v-if="badgeData" />
        <rating :rank="item.question.rating" v-if="type === 'Questions'" />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BadgeModel } from "../../models/badge.model";
import { openModal, projectData, userData } from "../../services/data.service";
import Badge from "./Badge.vue";
import Rating from "./Rating.vue";

export default defineComponent({
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    components: { Badge, Rating },
    setup(props) {
        const router = useRouter();
        const route = useRoute();
        const type = computed(() => {
            if (route.name === "Home") return "Projects";
            else if (route.name === "ProjectUsers") return "Users";
            else if (route.name === "ProjectQuestions") return "Questions";
        });
        const badgeData = computed<BadgeModel>(() => {
            const isProjectPageOwner =
                type.value === "Projects" && props.item.owner === userData._id;
            const isUserPageOwner =
                type.value === "Users" && projectData.owner === userData._id;
            if (isProjectPageOwner || isUserPageOwner) {
                return ["highlight", "owner"];
            } else if (type.value === "Questions") {
                if (props.item.state === "New")
                    return ["highlight", "NO ANSWERS"];
                if (props.item.state === "Answered")
                    return ["invert", `${props.item.answerCount} ANSWERS`];
                if (props.item.state === "Accepted")
                    return ["invert", "ANSWER ACCEPTED"];
            }
        });
        function goTo() {
            if (type.value === "Projects") {
                router.push({
                    name: "ProjectUsers",
                    params: { projectId: props.item._id }
                });
            } else if (type.value === "Users") {
                const { name, username, avatar } = props.item;
                openModal({
                    type: "userProfile",
                    title: username,
                    message: { name, avatar }
                });
            } else if (type.value === "Questions") {
                router.push({
                    name: "Question",
                    params: {
                        projectId: route.params.projectId,
                        questionId: props.item._id
                    }
                });
            }
        }
        return { badgeData, goTo, type };
    }
});
</script>

<style lang="scss" scoped>
.item {
    background-color: var(--bubble-color);
    border-radius: 4px;
    width: 100%;
    display: flex;
    padding: 0.6rem 0.5rem;
    cursor: pointer;
    .title {
        font-size: 1.2rem;
        text-align: left;
        flex: 1;
    }
}
</style>
