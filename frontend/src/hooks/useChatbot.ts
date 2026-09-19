import { useCallback, useState } from "react";
import API from "../api/axios";
import type { ChatbotResponse } from "../types/chatbot";

export const useChatbot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      const authError = "Your session has expired. Please log in again.";
      setError(authError);
      throw new Error(authError);
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return "";

    setIsLoading(true);
    setError(null);

    try {
      const response = await API.post<ChatbotResponse>(
        "/chatbot",
        { message: trimmedMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const answer = response.data?.answer?.trim();

      if (!answer) {
        throw new Error("The chatbot returned an empty response.");
      }

      return answer;
    } catch (err: any) {
      const messageFromServer =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to connect to the Smart Kisan assistant.";

      setError(messageFromServer);
      throw new Error(messageFromServer);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sendMessage,
    isLoading,
    error,
  };
};
