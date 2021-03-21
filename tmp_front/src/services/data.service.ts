import { reactive, ref } from "vue";
import { UserModel } from "@/models/user.model";
import { Modal } from "@/models/modal.model";
import { ProjectModel } from "@/models/project.model";
import { socket } from "@/main";
import router from "@/router";
import { SocketProjects, SocketQuestions } from "@/models/socket.models";

export const loadingState = ref(false);

export const userData = reactive<UserModel>({
    _id: "",
    name: "",
    projects: [],
    username: ""
});

export const projectData = reactive<ProjectModel>({
    _id: "",
    name: "",
    owner: "",
    questions: [],
    users: []
});

export const setUserData = (user: UserModel) => {
    socket.emit("subscribe", { user: user._id, projects: user.projects });
    userData._id = user._id;
    userData.name = user.name;
    userData.projects = user.projects;
    userData.username = user.username;
};

export const removeUserProject = (projectId: string) => {
    userData.projects = userData.projects.filter(prj => prj._id !== projectId);
    socket.emit("subscribeLess", { type: "project", id: projectId });
};

export const setProjectData = (project: ProjectModel) => {
    projectData._id = project._id;
    projectData.name = project.name;
    projectData.questions = project.questions;
    projectData.users = project.users;
    projectData.owner = project.owner;
};

export const modalData = reactive<Modal>({
    open: false,
    title: "",
    message: "",
    type: "info"
});

export const openModal = ({
    type = "info",
    message = "",
    title = ""
}: Partial<Modal>) => {
    if (type === "createProject") {
        title = "Create a new project";
    }
    if (type === "DeleteWarning") {
        title = "Are you sure?";
        message = projectData.name;
    }
    modalData.open = true;
    modalData.type = type;
    modalData.message = message;
    modalData.title = title;
};

export const closeModal = () => {
    modalData.open = false;
};

export const connectSocketToData = () => {
    socket.on("projects", (data: SocketProjects) => {
        if (data.action === "create") {
            userData.projects.push(data.project);
            socket.emit("subscribeMore", {
                type: "project",
                id: data.project._id
            });
        } else if (data.action === "delete") {
            const { _id, name } = data.project;
            removeUserProject(_id);
            openModal({
                type: "info",
                message: `Project ${name} was removed.`,
                title: "Juest letting you know"
            });
            const current = router.currentRoute.value;
            if (
                /^Project/.test(current.name as string) &&
                current.params.projectId === _id
            ) {
                router.replace({ name: "Home" });
            }
        } else if (data.action === "rename") {
            const { _id, name } = data.project;
            const projectIndex = userData.projects.findIndex(
                prj => prj._id === _id
            );
            if (projectIndex >= 0) {
                userData.projects[projectIndex].name = name;
            }
            if (projectData._id === _id) {
                projectData.name = name;
            }
        }
    });
    socket.on("questions", (data: SocketQuestions) => {
        if (data.action === "create") {
            const {
                _id,
                answerCount,
                project,
                state,
                title,
                question
            } = data.question;
            if (projectData?._id === project) {
                projectData.questions.push({
                    _id,
                    answerCount,
                    state,
                    title,
                    question
                });
            }
        } else if (data.action === "edit") {
            const {
                _id,
                answerCount,
                project,
                state,
                title,
                question
            } = data.question;
            if (projectData?._id === project) {
                const questionIndex = projectData.questions.findIndex(
                    qst => qst._id === _id
                );
                if (questionIndex >= 0) {
                    projectData.questions[questionIndex] = {
                        _id,
                        answerCount,
                        state,
                        title,
                        question
                    };
                }
            }
        }
    });
};
