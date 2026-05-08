import { useState, useCallback } from 'react';

export function useAiStream() {
  const [text, setText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateBio = useCallback(async (params: { name: string; profession: string; tone: string; length: string }) => {
    setIsStreaming(true);
    setText('');
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/generate-bio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to generate bio');
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') {
              setIsStreaming(false);
              return;
            }
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                setText(prev => prev + data.text);
              }
            } catch (e) {
              console.error('Failed to parse SSE JSON', e);
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsStreaming(false);
    }
  }, []);

  return { text, isStreaming, error, generateBio, setText };
}
