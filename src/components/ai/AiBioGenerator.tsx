import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  History,
  Wand2,
  ChevronDown,
  ChevronUp,
  Brain,
  Zap,
  Palette,
  BookOpen,
  Hash,
  Quote,
  RefreshCw,
} from "lucide-react";
import { useUpdateProfile } from "../../hooks/useProfile";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { copyToClipboard } from "../../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { generateBioStream, getAiHistory } from "../../services/ai-bio.service";

const TONES = [
  { value: "professional", label: "Professional", icon: BriefcaseIcon },
  { value: "casual", label: "Casual", icon: MessageSquareIcon },
  { value: "humorous", label: "Humorous", icon: SmileIcon },
  { value: "minimalist", label: "Minimalist", icon: HeartIcon },
];

const LENGTHS = [
  { value: "short", label: "Short (~50 words)", icon: ChevronUp },
  { value: "medium", label: "Medium (~100 words)", icon: ChevronDown },
  { value: "long", label: "Long (~200 words)", icon: BookOpen },
];

const SUGGESTIONS = [
  "Creative designer & problem solver",
  "Tech enthusiast building the future",
  "Storyteller at heart, developer by trade",
  "Turning coffee into code since 2020",
  "Passionate about UX & accessibility",
];

function BriefcaseIcon() { return <span className="text-xs">💼</span>; }
function MessageSquareIcon() { return <span className="text-xs">💬</span>; }
function SmileIcon() { return <span className="text-xs">😊</span>; }
function HeartIcon() { return <span className="text-xs">❤️</span>; }

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: "hsl(var(--primary))",
            animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

function TypingCursor() {
  return (
    <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
  );
}

function ThinkingOrb() {
  return (
    <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
      <div
        className="absolute inset-0 rounded-full animate-spin"
        style={{
          border: "2px solid transparent",
          borderTopColor: "hsl(var(--primary))",
          borderBottomColor: "hsl(var(--primary))",
          animation: "spin 1s linear infinite",
        }}
      />
      <div
        className="absolute inset-1 rounded-full animate-spin"
        style={{
          border: "2px solid transparent",
          borderLeftColor: "hsl(var(--primary) / 0.4)",
          borderRightColor: "hsl(var(--primary) / 0.4)",
          animation: "spin 1.5s linear infinite reverse",
        }}
      />
      <div
        className="w-5 h-5 rounded-full"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.6))",
          boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
        }}
      />
    </div>
  );
}

export function AiBioGenerator() {
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [customPrompt, setCustomPrompt] = useState("");
  const [includeLinks, setIncludeLinks] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<"generate" | "history">("generate");

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedBio, setGeneratedBio] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateProfile = useUpdateProfile();

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [generatedBio]);

  useEffect(() => {
    if (!isLoading && generatedBio) {
      inputRef.current?.focus();
    }
  }, [isLoading, generatedBio]);

  const handleGenerate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const prompt = input.trim() || customPrompt.trim();
      if (!prompt || isLoading) return;

      setLastPrompt(prompt);
      setIsLoading(true);
      setGeneratedBio("");
      setActiveTab("generate");

      try {
        await generateBioStream(
          { customPrompt: prompt, tone, length, includeLinks },
          (content) => setGeneratedBio((prev) => prev + content),
          () => setIsLoading(false),
        );
      } catch {
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
    cleaned = cleaned.replace(/^["']+|["']+$/g, "");
    cleaned = cleaned.replace(/^here'?s?\s*(a\s*)?(possible\s*)?bio:?[\s\n]*/i, "");
    cleaned = cleaned.replace(/^here'?s?\s*your\s*bio:?[\s\n]*/i, "");
    cleaned = cleaned.replace(/^sure[!,.]*\s*/i, "");
    cleaned = cleaned.replace(/^of\s*course[!,.]*\s*/i, "");
    cleaned = cleaned.replace(/^certainly[!,.]*\s*/i, "");
    cleaned = cleaned.replace(/^absolutely[!,.]*\s*/i, "");
    cleaned = cleaned.replace(/^no\s*problem[!,.]*\s*/i, "");
    cleaned = cleaned.replace(/\n\nwould you like me to.*$/i, "");
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
    return cleaned.trim();
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

  const generations = (Array.isArray(historyData)
    ? historyData
    : historyData?.data || historyData?.generations || []
  ).filter((g: any) => !g.wasApplied);
  const totalTokens = generations.reduce(
    (sum: number, g: any) => sum + (g.tokensTotal || 0), 0,
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border-2 p-8 md:p-10"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--primary) / 0.02))",
          borderColor: "hsl(var(--primary) / 0.2)",
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ background: "hsl(var(--primary))", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-10" style={{ background: "hsl(var(--primary))", transform: "translate(-20%, 20%)" }} />
        <div className="relative flex items-start gap-6">
          <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl shrink-0" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.6))", boxShadow: "0 8px 32px hsl(var(--primary) / 0.3)" }}>
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "hsl(var(--primary))" }}>
              AI Bio Generator
            </h1>
            <p className="text-muted-foreground text-base max-w-xl">
              Create a compelling bio that captures your unique story. Describe yourself and let AI craft the perfect introduction.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {SUGGESTIONS.slice(0, 3).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="px-3 py-1.5 text-xs rounded-full border transition-all hover:scale-105"
                  style={{ borderColor: "hsl(var(--primary) / 0.3)", color: "hsl(var(--primary))", backgroundColor: "hsl(var(--primary) / 0.05)" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="relative flex mt-6 p-1 rounded-2xl max-w-[280px]" style={{ backgroundColor: "hsl(var(--muted))" }}>
          <button
            onClick={() => setActiveTab("generate")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === "generate" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Wand2 className="w-4 h-4" />
            Generate
          </button>
          <div className="w-px h-6 self-center" style={{ backgroundColor: "hsl(var(--primary) / 0.15)" }} />
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === "history" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="w-4 h-4" />
            History
            {generations.length > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{generations.length}</span>
            )}
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === "generate" ? (
          <motion.div
            key="generate"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Settings Collapsible */}
            <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: "hsl(var(--primary) / 0.1)" }}>
                    <Palette className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                  </div>
                  <span className="font-medium">Generation Settings</span>
                </div>
                {showSettings ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 border-t space-y-4" style={{ borderColor: "hsl(var(--border))" }}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Tone</Label>
                          <Select value={tone} onValueChange={setTone}>
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TONES.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                  <span className="flex items-center gap-2">
                                    <t.icon />
                                    {t.label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Length</Label>
                          <Select value={length} onValueChange={setLength}>
                            <SelectTrigger className="h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {LENGTHS.map((l) => (
                                <SelectItem key={l.value} value={l.value}>
                                  <span className="flex items-center gap-2">
                                    <l.icon className="w-4 h-4" />
                                    {l.label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: "hsl(var(--border))" }}>
                        <div className="flex items-center gap-3">
                          <Hash className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Include My Links</p>
                            <p className="text-xs text-muted-foreground">Add your profile links to the bio</p>
                          </div>
                        </div>
                        <Switch checked={includeLinks} onCheckedChange={setIncludeLinks} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Custom Prompt (optional)</Label>
                        <textarea
                          placeholder="Add specific instructions for the AI..."
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          rows={2}
                          className="w-full rounded-xl border-2 bg-background px-4 py-3 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          style={{ borderColor: "hsl(var(--border))" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Generation Area */}
            <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}>
              {/* Output Area */}
              <div
                ref={outputRef}
                className="p-6 min-h-[200px] max-h-[350px] overflow-y-auto scroll-smooth"
                style={{ backgroundColor: "hsl(var(--primary) / 0.02)" }}
              >
                {!generatedBio && !isLoading && (
                  <div className="flex flex-col items-center justify-center h-full min-h-[160px] text-center">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ backgroundColor: "hsl(var(--primary) / 0.08)" }}>
                      <Quote className="w-6 h-6" style={{ color: "hsl(var(--primary))" }} />
                    </div>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      Describe yourself below and I'll craft a unique bio for you
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => { setInput(s); inputRef.current?.focus(); }}
                          className="px-2 py-1 text-xs rounded-md border text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {s.length > 30 ? s.slice(0, 30) + "..." : s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isLoading && !generatedBio && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full min-h-[160px] text-center gap-4"
                  >
                    <ThinkingOrb />
                    <div>
                      <motion.p
                        className="text-sm font-semibold"
                        style={{ color: "hsl(var(--primary))" }}
                        animate={{ opacity: [1, 0.6, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        AI is thinking
                      </motion.p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Crafting your perfect bio<LoadingDots />
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      {["Analyzing", "Generating", "Refining"].map((step, i) => (
                        <motion.span
                          key={step}
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: "hsl(var(--primary) / 0.08)",
                            color: "hsl(var(--primary))",
                          }}
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 2, delay: i * 0.6, repeat: Infinity }}
                        >
                          {step}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {generatedBio && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="prose prose-sm max-w-none"
                  >
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                      <div className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ backgroundColor: "hsl(var(--primary) / 0.1)" }}>
                        <Sparkles className="w-3.5 h-3.5" style={{ color: "hsl(var(--primary))" }} />
                      </div>
                      <span className="text-sm font-medium">Generated Bio</span>
                      <span className="text-xs text-muted-foreground ml-auto">{generatedBio.length} chars</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {generatedBio}
                      {isLoading && <TypingCursor />}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Actions Bar */}
              <AnimatePresence>
                {generatedBio && !isLoading && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}
                  >
                    <div className="flex gap-2 p-3 bg-accent/20">
                      <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1 gap-1.5 h-9">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleRegenerate} className="flex-1 gap-1.5 h-9">
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </Button>
                      <Button size="sm" onClick={handleSaveToProfile} disabled={isSaving || updateProfile.isPending} className="flex-1 gap-1.5 h-9">
                        {isSaving || updateProfile.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Save to Profile
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Form */}
              <div className="border-t p-4" style={{ borderColor: "hsl(var(--border))" }}>
                <form onSubmit={handleGenerate} className="flex gap-2">
                  <input
                    ref={inputRef}
                    placeholder="Describe yourself — e.g., UI designer, developer..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 h-12 px-4 rounded-xl border-2 bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                    style={{ borderColor: "hsl(var(--border))" }}
                  />
                  <Button type="submit" disabled={isLoading} className="h-12 px-5 gap-2 shrink-0">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Zap className="h-5 w-5" />
                    )}
                    <span className="hidden sm:inline">Generate</span>
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Stats Bar */}
            {generations.length > 0 && (
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[120px] rounded-xl border-2 p-4" style={{ borderColor: "hsl(var(--border))" }}>
                  <p className="text-2xl font-bold" style={{ color: "hsl(var(--primary))" }}>{generations.length}</p>
                  <p className="text-xs text-muted-foreground">Generations</p>
                </div>
                <div className="flex-1 min-w-[120px] rounded-xl border-2 p-4" style={{ borderColor: "hsl(var(--border))" }}>
                  <p className="text-2xl font-bold" style={{ color: "hsl(var(--primary))" }}>{totalTokens.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Tokens Used</p>
                </div>
              </div>
            )}

            {generations.length > 0 ? (
              <div className="space-y-3">
                {generations.map((gen: any, i: number) => (
                  <motion.div
                    key={gen.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl border-2 overflow-hidden transition-all hover:shadow-md"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{new Date(parseInt(gen.createdAt) * 1000).toLocaleDateString()}</span>
                        <span>·</span>
                        <span>{gen.model || "AI"}</span>
                        <span>·</span>
                        <span>{gen.tokensTotal || 0} tokens</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed line-clamp-3">{gen.response}</p>
                    </div>
                    {gen.response && (
                      <div className="px-4 py-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApplyFromHistory(gen.response)}
                          disabled={isSaving}
                          className="w-full gap-1.5"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          Apply to Profile
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl border-2" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: "hsl(var(--primary) / 0.08)" }}>
                  <History className="w-8 h-8" style={{ color: "hsl(var(--primary))" }} />
                </div>
                <p className="text-muted-foreground">No generation history yet</p>
                <p className="text-sm text-muted-foreground mt-1">Start generating to see your bios here</p>
                <Button variant="outline" className="mt-4 gap-2" onClick={() => setActiveTab("generate")}>
                  <Wand2 className="w-4 h-4" />
                  Generate Your First Bio
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
