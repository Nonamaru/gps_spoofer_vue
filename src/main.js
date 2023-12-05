import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'

import { createPinia } from 'pinia'

import { globalCookiesConfig } from "vue3-cookies";

globalCookiesConfig({
    expireTimes: "30d",
    path: "/",
    domain: "",
    secure: true,
    sameSite: "None",
});

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')