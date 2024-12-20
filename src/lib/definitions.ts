export type User = {
    id: number;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
}

export type UserRead = {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
}

export type UserCreate = {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
}
export type UserLogin = {
    username: string;
    password: string;
}

export type Inbox = {
    id: number;
    created_by: number;
    received_by: number;
    created_at: Date;
    has_chatguard: boolean;
    bot_model: BotModel;
}

export type InboxCreate = {
    created_by: number;
    received_by: number;
    has_chatguard: false;
}

export type InboxPreview = {
    id: number;
    display_name: string;
    last_message: string;
    last_sender: number;
    message_date: Date;
}

export type Conversation = {
    id: number;
    inbox_id: number;
    sender_id: number;
    text: string;
    created_at: Date;
}

export type InfoMessage = {
    message: string;
}

export type Message = {
    inbox_id: number;
    sender_id: number;
    text: string;
    has_chatguard: boolean;
    bot_model: BotModel;
}
export type MessagePreview = {
    convo_id: string;
    display_name: string;
    last_message: string;
}

export type ChatguardPrompt = {
    inbox_id: number;
    sender_id: number;
    text: string;
    has_chatguard: boolean;
    bot_model: BotModel;
}

export enum ChatguardCommand {
    enable = "enable",
    disable = "disable",
    help = "help",
    status = "status"
}
export enum BotModel {
    RNN = "rnn",
    RANDOM_FOREST = "random_forest",
    SVG = "svg"
}