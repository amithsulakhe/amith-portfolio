const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export type HistoryMessage = {
    role: "user" | "assistant";
    content: string;
};

export const sendMessageToBot = async (question: string, history: HistoryMessage[] = []) => {
    try {
        const url = API_URL.startsWith("http") ? `${API_URL}/chat` : `${API_URL}/chat`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, history }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Request failed");
        return data;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to connect to the server";
        throw new Error(message);
    }
};
