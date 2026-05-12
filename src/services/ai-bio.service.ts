import axiosInstance from "../lib/axios";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/api";

export const generateBioStream = async (
  data: {
    customPrompt: string;
    tone?: string;
    length?: string;
    includeLinks?: boolean;
  },
  onChunk: (content: string) => void,
  onDone: () => void,
): Promise<void> => {
  const token = sessionStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AI_BIO.GENERATE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Generation failed");

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      onDone();
      break;
    }
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const parsed = JSON.parse(line.slice(6));
          if (parsed.content && parsed.content !== "[DONE]") {
            onChunk(parsed.content);
          }
        } catch {}
      }
    }
  }
};

export const getAiHistory = async (): Promise<any> => {
  const response = await axiosInstance.get(API_ENDPOINTS.AI_BIO.HISTORY);
  return response.data.data;
};

export const applyBioToProfile = async (
  generationId: string,
): Promise<void> => {
  await axiosInstance.post(API_ENDPOINTS.AI_BIO.APPLY, { generationId });
};
