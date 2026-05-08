import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { generateBioStream } from '../services/ai-bio.service';

interface GenerateBioRequest {
  customPrompt: string;
  tone?: string;
  length?: string;
  includeLinks?: boolean;
}

export const useAiBio = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBio, setGeneratedBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generate = useCallback(async (data: GenerateBioRequest) => {
    setIsGenerating(true);
    setGeneratedBio('');
    setError(null);

    try {
      let fullBio = '';
      
      await generateBioStream(
        data,
        (content) => { fullBio += content; },
        () => {}
      );

      setGeneratedBio(fullBio);
      
      toast({
        title: 'Bio generated',
        description: 'Your AI bio has been successfully generated.',
      });
      
      return fullBio;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to generate bio';
      setError(errorMessage);
      
      toast({
        title: 'Generation failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const reset = useCallback(() => {
    setGeneratedBio('');
    setError(null);
  }, []);

  return {
    isGenerating,
    generatedBio,
    error,
    generate,
    setGeneratedBio,
    reset,
  };
};