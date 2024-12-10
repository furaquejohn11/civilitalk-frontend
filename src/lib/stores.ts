import { writable } from "svelte/store";

export const websocketStore = writable<WebSocket | null>(null);

export function initializeWebSocket(userId: number) {
    const socket = new WebSocket("ws://localhost:8000/ws/chat");
    
    socket.onopen = () => {
        console.log("WebSocket connection established");
        websocketStore.set(socket);
    };

    socket.onclose = () => {
        console.log("WebSocket connection closed");
        websocketStore.set(null);
    };

    return socket;
}