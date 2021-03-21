import axios from "axios";

import { UserModel } from "@/models/user.model";
import { getJWTCookie } from "./auth.service";
import {
    setUserData,
    loadingState,
    userData,
    openModal,
    setProjectData
} from "./data.service";
import { ProjectModel } from "@/models/project.model";

export const getAllProjects = async () => {
    loadingState.value = true;
    try {
        if (userData._id) return;
        const token = getJWTCookie();
        if (!token) throw new Error();
        const response = await axios.get<UserModel>(
            `${process.env?.VUE_APP_BASE_URL}projects`,
            {
                headers: { Authorization: token }
            }
        );
        if (response.status === 200) setUserData(response.data);
        else throw new Error();
    } catch {
        return false;
    } finally {
        loadingState.value = false;
    }
};

export const getAProject = async (id: string) => {
    loadingState.value = true;
    try {
        const token = getJWTCookie();
        if (!token) throw new Error();
        const response = await axios.get<ProjectModel>(
            `${process.env?.VUE_APP_BASE_URL}projects/${id}`,
            {
                headers: { Authorization: token }
            }
        );
        setProjectData(response.data);
    } catch {
        return false;
    } finally {
        loadingState.value = false;
    }
};

export const deleteAProject = async (id: string) => {
    loadingState.value = true;
    try {
        const token = getJWTCookie();
        if (!token) throw new Error();
        await axios.delete<ProjectModel>(
            `${process.env?.VUE_APP_BASE_URL}projects/${id}`,
            {
                headers: { Authorization: token }
            }
        );
        return true;
    } catch {
        return false;
    } finally {
        loadingState.value = false;
    }
};

export const createNewProject = async (name: string) => {
    loadingState.value = true;
    const token = getJWTCookie();
    const response = await axios.post(
        `${process.env?.VUE_APP_BASE_URL}projects`,
        { name },
        {
            headers: { Authorization: token }
        }
    );
    openModal({
        type: "info",
        message: `Project ${response.data.name} was created succesfully`,
        title: "Great news!"
    });
    loadingState.value = false;
};
