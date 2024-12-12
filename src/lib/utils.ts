import axios from "axios";
import type { ChatguardPrompt} from "./definitions";
import { ChatguardCommand } from "./definitions";
// import { WebSocket } from "vite";

// API URL Endpoint
export const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        'Content-Type' : 'application/json'
    },
});

export const hasChatguard = async (inbox_id: number): Promise<boolean> => {
  const response = await apiClient.get(`/chatguard/inbox`, {
    params: { inbox_id: inbox_id},
    });

    return response.data;
}

export const executeChatguard = async (
  inboxId: number,
  userFullName: string,
  command: ChatguardCommand
): Promise<ChatguardPrompt> => {
  const response = await apiClient.get<ChatguardPrompt>(`/chatguard/${command}`, {
    params: { inbox_id: inboxId, name: userFullName }
  });
  return response.data;
}

const commands = ["/chatguard-on", "/chatguard-off", "chatguard-help"];
export const isChatguardCommand = (message: string): boolean => { 
    const isCommand = commands.some(command => message.trim().startsWith(command));
    return isCommand
}
// export const isChatguardCommand = (message: string): boolean => {
//   const prefix = "/chatguard-";
//   return Object.values(ChatguardCommand).some(command => message.trim().startsWith(prefix + command));
// }

// Date time formatter
export const formatDate = (date: Date): string => {
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    // Convert both `date` and comparison dates to "start of day" for accurate comparison
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (date >= startOfToday) {
      // For today, show only time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date >= startOfYesterday) {
      // For yesterday, show "YTD" and time
      return `ytd ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      // For older messages, show full date
      return date.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
};