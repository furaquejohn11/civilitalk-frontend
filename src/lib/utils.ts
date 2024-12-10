import axios from "axios";
// import { WebSocket } from "vite";

// API URL Endpoint
export const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        'Content-Type' : 'application/json'
    },
});

const commands = ["/chatguard-on", "/chatguard-off", "chatguard-help"];
export const isChatguardCommand = (message: string): boolean => { 
    const isCommand = commands.some(command => message.trim().startsWith(command));
    if (isCommand) {
      switch (message) {
        case "/chatguard-on":
          chatGuardOn();
          break;
        
        case "/chatguard-off":
          chatGuardOff();
          break;

        case "/chatguard-help":
          chatGuardHelp();
          break;

        default:
          alert("chat guard command must not have any arguments.");

      }
    }

    return isCommand
}

const chatGuardOn = () => {
  alert('ON');
}
const chatGuardOff = () => {
  alert('OFF');
}
const chatGuardHelp = () => {
  alert('HELP');
}


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