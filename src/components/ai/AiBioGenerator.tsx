import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Loader2,
  Copy,
  RotateCw,
  Check,
  History,
  Link2,
  Wand2,
  MessageSquare,
} from "lucide-react";
import { useUpdateProfile } from "../../hooks/useProfile";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { copyToClipboard } from "../../lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { generateBioStream, getAiHistory } from "../../services/ai-bio.service";

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "humorous", label: "Humorous" },
  { value: "bold", label: "Bold" },
  { value: "friendly", label: "Friendly" },
];

const LENGTHS = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

export function AiBioGenerator() {
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [customPrompt, setCustomPrompt] = useState("");
  const [includeLinks, setIncludeLinks] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedBio, setGeneratedBio] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");

  const updateProfile = useUpdateProfile();

  const handleGenerate = useCallback(
async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim() || customPrompt.trim();
    if (!prompt || isLoading) return;

    setLastPrompt(prompt);
      setIsLoading(true);
      setGeneratedBio("");

      try {
        await generateBioStream(
          { customPrompt: prompt, tone, length, includeLinks },
          (content) => setGeneratedBio((prev) => prev + content),
          () => setIsLoading(false),
        );
      } catch (error) {
        console.error("[DEBUG] Generation error:", error);
        setIsLoading(false);
      } finally {
        setInput("");
      }
    },
    [input, customPrompt, tone, length, includeLinks, isLoading],
  );

  const { data: historyData, refetch: refetchHistory } = useQuery({
    queryKey: ["ai-history"],
    queryFn: getAiHistory,
  });

  const cleanBioText = (text: string): string => {
    if (!text) return "";

    let cleaned = text;

    // Remove quotes and extra whitespace at start/end
    cleaned = cleaned.replace(/^["']+|["']+$/g, "");

    // Remove AI prefixes (case insensitive)
    cleaned = cleaned.replace(
      /^here'?s?\s*(a\s*)?(possible\s*)?bio:?[\s\n]*/i,
      "",
    );
    cleaned = cleaned.replace(/^here'?s?\s*your\s*bio:?[\s\n]*/i, "");
    cleaned = cleaned.replace(
      /^here'?s?\s*\w+\s*bio\s*for\s*you:?[\s\n]*/i,
      "",
    );
    cleaned = cleaned.replace(/^sure[!,.]*\s*/i, "");
    cleaned = cleaned.replace(/^of\s*course[!,.]*\s*/i, "");
    cleaned = cleaned.replace(/^certainly[!,.]*\s*/i, "");
    cleaned = cleaned.replace(/^absolutely[!,.]*\s*/i, "");
    cleaned = cleaned.replace(/^no\s*problem[!,.]*\s*/i, "");

    // Remove ending questions like "Would you like me to modify..."
    cleaned = cleaned.replace(/\n\nwould you like me to.*$/i, "");
    cleaned = cleaned.replace(/\nwould you like.*$/i, "");
    cleaned = cleaned.replace(/would you like me to.*$/i, "");

    // Clean up extra whitespace and newlines
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
    cleaned = cleaned.trim();

    return cleaned;
  };

  const handleCopy = useCallback(() => {
    if (generatedBio) {
      copyToClipboard(generatedBio);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [generatedBio]);

  const handleRegenerate = useCallback(() => {
    const prompt = customPrompt || lastPrompt || "Generate a bio for me";
    setInput(prompt);
    handleGenerate(new Event("submit") as any);
  }, [customPrompt, lastPrompt, handleGenerate]);

  const handleSaveToProfile = useCallback(async () => {
    if (!generatedBio) return;

    const cleanedBio = cleanBioText(generatedBio);
    setIsSaving(true);
    try {
      await updateProfile.mutateAsync({ bioText: cleanedBio });
      refetchHistory();
    } finally {
      setIsSaving(false);
    }
  }, [generatedBio, updateProfile, refetchHistory]);

  const handleApplyFromHistory = useCallback(
    async (response: string) => {
      const cleanedBio = cleanBioText(response);
      setIsSaving(true);
      try {
        await updateProfile.mutateAsync({ bioText: cleanedBio });
        refetchHistory();
      } finally {
        setIsSaving(false);
      }
    },
    [updateProfile, refetchHistory],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg"
          style={{ boxShadow: "0 8px 32px hsl(var(--primary) / 0.25)" }}
        >
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1
          className="text-3xl font-bold"
          style={{ color: "hsl(var(--primary))" }}
        >
          AI Bio Generator
        </h1>
        <p className="text-muted-foreground">
          Create a compelling bio that captures your unique story
        </p>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full max-w-xs mx-auto bg-secondary/50">
          <TabsTrigger value="generate" className="gap-2">
            <Wand2 className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card
            className="border-2 shadow-lg"
            style={{ boxShadow: "0 8px 32px hsl(var(--primary) / 0.1)" }}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare
                  className="w-5 h-5"
                  style={{ color: "hsl(var(--primary))" }}
                />
                Settings
              </CardTitle>
              <CardDescription>Customize your bio generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Length</Label>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LENGTHS.map((l) => (
                        <SelectItem key={l.value} value={l.value}>
                          {l.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div
                className="flex items-center justify-between p-3 rounded-xl border-2"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <div className="flex items-center gap-3">
                  <Link2
                    className="h-5 w-5"
                    style={{ color: "hsl(var(--primary))" }}
                  />
                  <div>
                    <p className="text-sm font-medium">Include My Links</p>
                    <p className="text-xs text-muted-foreground">
                      Add your profile links to the bio
                    </p>
                  </div>
                </div>
                <Switch
                  checked={includeLinks}
                  onCheckedChange={setIncludeLinks}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Custom Prompt (optional)
                </Label>
                <Textarea
                  placeholder="Or write your own prompt..."
                  value={customPrompt}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setCustomPrompt(e.target.value)
                  }
                  rows={2}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-2 shadow-lg"
            style={{ boxShadow: "0 8px 32px hsl(var(--primary) / 0.1)" }}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Sparkles
                  className="w-5 h-5"
                  style={{ color: "hsl(var(--primary))" }}
                />
                Generate Your Bio
              </CardTitle>
              <CardDescription>
                Enter keywords or describe yourself
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chat Messages - Show as proper cards */}
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                {!generatedBio && !isLoading && (
                  <div className="text-center py-6 px-4 rounded-xl bg-secondary/20">
                    <Sparkles
                      className="w-10 h-10 mx-auto mb-3 opacity-40"
                      style={{ color: "hsl(var(--primary))" }}
                    />
                    <p className="text-sm text-muted-foreground">
                      Describe yourself or enter keywords to generate your bio
                    </p>
                  </div>
                )}

                {/* Show complete AI response as a proper card */}
                {generatedBio && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div
                      className="w-full rounded-xl overflow-hidden border-2"
                      style={{
                        backgroundColor: "hsl(var(--primary) / 0.05)",
                        borderColor: "hsl(var(--primary) / 0.3)",
                      }}
                    >
                      <div
                        className="px-4 py-2 border-b flex items-center gap-2"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        <Sparkles
                          className="w-4 h-4"
                          style={{ color: "hsl(var(--primary))" }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "hsl(var(--primary))" }}
                        >
                          Generated Bio
                        </span>
                        {generatedBio.length > 0 && (
                          <span className="text-xs text-muted-foreground ml-auto">
                            {generatedBio.length} chars
                          </span>
                        )}
                      </div>
                      {generatedBio.length > 0 ? (
                        <div className="p-4">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {generatedBio}
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          <span className="text-sm text-muted-foreground">
                            Generating...
                          </span>
                        </div>
                      )}
                      <div
                        className="px-4 py-3 border-t flex gap-2"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                          className="flex-1 gap-2"
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRegenerate}
                          className="flex-1 gap-2"
                        >
                          <RotateCw className="w-4 h-4" />
                          Regenerate
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveToProfile}
                          disabled={isSaving || updateProfile.isPending}
                          className="flex-1 gap-2"
                        >
                          {isSaving || updateProfile.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Save
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {isLoading && !generatedBio && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-secondary/50 dark:bg-secondary/30 rounded-2xl rounded-bl-md border-2 px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles
                          className="w-3 h-3 animate-pulse"
                          style={{ color: "hsl(var(--primary))" }}
                        />
                        <span
                          className="text-xs font-medium"
                          style={{ color: "hsl(var(--primary))" }}
                        >
                          AI
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleGenerate} className="flex gap-2">
                <Input
                  placeholder="e.g., UI designer, developer..."
                  value={input}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInput(e.target.value)
                  }
                  disabled={isLoading}
                  className="text-lg h-12"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-4"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {(() => {
            const generations = Array.isArray(historyData)
              ? historyData
              : historyData?.data || historyData?.generations || [];
            const totalTokens = generations.reduce(
              (sum: number, g: any) => sum + (g.tokensTotal || 0),
              0,
            );
            const totalBios = generations.filter((g: any) => g.response).length;

            return (
              <Card
                className="border-2 shadow-lg"
                style={{ boxShadow: "0 8px 32px hsl(var(--primary) / 0.1)" }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <History
                          className="w-5 h-5"
                          style={{ color: "hsl(var(--primary))" }}
                        />
                        Generation History
                      </CardTitle>
                      <CardDescription>
                        View your past AI-generated bios
                      </CardDescription>
                    </div>
                    {totalTokens > 0 && (
                      <div className="text-right">
                        <p
                          className="text-2xl font-bold"
                          style={{ color: "hsl(var(--primary))" }}
                        >
                          {totalTokens}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total Tokens
                        </p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {generations.length > 0 ? (
                    <div className="space-y-4">
                      {generations.map((gen: any) => (
                        <motion.div
                          key={gen.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="rounded-xl border-2 overflow-hidden"
                          style={{
                            backgroundColor: gen.wasApplied
                              ? "hsl(var(--primary) / 0.05)"
                              : "transparent",
                            borderColor: "hsl(var(--border))",
                          }}
                        >
                          <div
                            className="px-4 py-2 border-b flex items-center justify-between"
                            style={{ borderColor: "hsl(var(--border))" }}
                          >
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                parseInt(gen.createdAt) * 1000,
                              ).toLocaleDateString()}{" "}
                              · {gen.model}
                            </span>
                            <div className="flex items-center gap-2">
                              {gen.wasApplied && (
                                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-600 dark:text-green-400">
                                  <Check className="w-3 h-3 inline mr-1" />
                                  Applied
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {gen.tokensTotal || 0} tokens
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                              {gen.response}
                            </p>
                          </div>
                          {!gen.wasApplied && (
                            <div
                              className="px-4 py-3 border-t"
                              style={{ borderColor: "hsl(var(--border))" }}
                            >
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  handleApplyFromHistory(gen.response)
                                }
                                disabled={isSaving}
                                className="w-full gap-2"
                              >
                                {isSaving ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                                Apply to Profile
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4"
                        style={{ backgroundColor: "hsl(var(--primary) / 0.1)" }}
                      >
                        <History
                          className="w-8 h-8"
                          style={{ color: "hsl(var(--primary))" }}
                        />
                      </div>
                      <p className="text-muted-foreground">
                        No generation history yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Start generating to see your bios here
                      </p>
                    </div>
                  )}
                  {totalBios > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Total Bios Generated:</span>
                        <span className="font-medium">{totalBios}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })()}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
