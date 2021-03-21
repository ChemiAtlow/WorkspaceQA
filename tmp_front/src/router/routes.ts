import { RouteRecordRaw } from "vue-router";

import { authToBackend, getCallbackRoute } from "../services/auth.service";

import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Question from "@/views/Question.vue";
import GridHolder from "@/components/GridPage/GridHolder.vue";
import { loadingState, openModal } from "@/services/data.service";

const lazyLoader = (fn: () => Promise<typeof import("*.vue")>) => {
    loadingState.value = true;
    const done = () => (loadingState.value = false);
    const promise = fn();
    promise.then(done, done);
    return promise;
};

export const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: {
            requiresAuth: true,
            transitionNameParent: "Home"
        }
    },
    {
        path: "/projects/:projectId",
        name: "projectPage",
        component: Home,
        meta: {
            requiresAuth: true,
            transitionNameParent: "Projects"
        },
        children: [
            {
                path: "",
                redirect: "users",
                meta: {
                    transitionNameParent: "Home"
                }
            },
            {
                path: "users",
                name: "ProjectUsers",
                component: GridHolder,
                meta: {
                    transitionNameChild: "Users"
                }
            },
            {
                path: "questions",
                name: "ProjectQuestions",
                component: GridHolder,
                meta: {
                    transitionNameChild: "Questions"
                }
            }
        ]
    },
    {
        path: "/:projectId/questions/:questionId",
        name: "Question",
        component: Question,
        meta: {
            requiresAuth: true,
            transitionNameParent: "Question"
        }
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        props: true,
        meta: {
            guestOnly: true,
            transitionNameParent: "Login"
        }
    },
    {
        path: "/login/callback",
        beforeEnter: async (to, _, next) => {
            loadingState.value = true;
            const { code } = to.query;
            if (!code) {
                return next("/login");
            }
            const res = await authToBackend(`${code}`);
            if (res) {
                loadingState.value = false;
                openModal({ type: "error", title: "Oh oh", message: res });
            }
            const route = getCallbackRoute() || "/";
            loadingState.value = false;
            next(route);
        },
        component: Login
    },
    {
        path: "/about",
        name: "About",
        component: () =>
            lazyLoader(() =>
                import(/* webpackChunkName: "about" */ "@/views/About.vue")
            ),
        meta: {
            transitionNameParent: "About"
        }
    },
    {
        path: "/:catchAll(.*)",
        component: () =>
            lazyLoader(() =>
                import(
                    /* webpackChunkName: "notFound" */ "@/views/NotFound.vue"
                )
            ),
        meta: {
            transitionNameParent: "NotFound"
        }
    }
];
