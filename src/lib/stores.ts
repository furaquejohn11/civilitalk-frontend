import { writable } from "svelte/store";
import type { UserRead, User } from "./definitions";

function isClient() {
    return typeof window !== 'undefined';
}


// export const userStore = writable<UserRead>({

// });