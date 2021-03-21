import { validateJWTCookie } from "@/services/auth.service";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach(async (to, _, next) => {
    const cookie = await validateJWTCookie();
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!cookie) {
            next({
                name: "Login",
                params: { nextUrl: to.fullPath }
            });
        } else {
            next();
        }
    } else if (to.matched.some(record => record.meta.guestOnly)) {
        if (!cookie) {
            next();
        } else {
            next("/");
        }
    } else {
        next();
    }
});
router.afterEach((to, from) => {
    const toDepth = to.path.split("/").length;
    const fromDepth = from.path.split("/").length;
    to.meta.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
});

export default router;
