import { createApp } from "vue";
import io from "socket.io-client";
import { ClickOutsideDirective } from "./directives/ClickOutside";
import App from "./App.vue";
import router from "./router";
import Loader from "@/components/Loader/Loader.vue";
import Button from "@/components/Button/Button.vue";
import Input from "@/components/Input/index.vue";
import { connectSocketToData } from "./services/data.service";

const app = createApp(App);
export const socket = io(process.env.VUE_APP_BASE_URL);
connectSocketToData();

app.component("Loader", Loader);
app.component("AppButton", Button);
app.component("AppInput", Input);

app.directive("click-out-of", ClickOutsideDirective);

app.use(router).mount("#app");
