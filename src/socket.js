import { reactive } from "vue";
import * as io from "socket.io-client";

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? undefined : "https://localhost:8081";

export const socket = io(`${URL}`);

socket.on("connect", () => {
    state.connected = true;
    console.log("connected!");
});

socket.on("disconnect", () => {
    state.connected = false;
    console.log("disconnected!");
});