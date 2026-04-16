import { useState, useRef, useEffect } from "react";
import { ChatSidebar } from "@/components/detect/ChatSidebar";
import { ChatInput } from "@/components/detect/ChatInput";
import { ChatMessage } from "@/components/detect/ChatMessage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PanelLeft, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type InputMode = "text" | "url" | "image";

interface AnalysisResult {
  credibilityScore: number;
  verdict: "likely_true" | "likely_false" | "uncertain";
  summary: string;
  keyFindings: string[];
  sources: { name: string; url: string; reliability: string }[];
}

interface Message {
  id: string;
  type: "user" | "assistant";
  inputType?: InputMode;
  content: string;
  imageUrl?: string;
  analysis?: AnalysisResult;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  date: string;
  type: InputMode;
}

// Mock data for demo
const mockHistory: ChatHistory[] = [
  { id: "1", title: "COVID vaccine claims article", date: "Today", type: "text" },
  { id: "2", title: "Political news from Twitter", date: "Today", type: "url" },
  { id: "3", title: "Viral screenshot analysis", date: "Yesterday", type: "image" },
  { id: "4", title: "Climate change report", date: "Yesterday", type: "text" },
  { id: "5", title: "Election misinformation check", date: "3 days ago", type: "url" },
];

const generateMockAnalysis = (inputType: InputMode): AnalysisResult => {
  const verdicts: ("likely_true" | "likely_false" | "uncertain")[] = [
    "likely_true",
    "likely_false",
    "uncertain",
  ];
  const randomVerdict = verdicts[Math.floor(Math.random() * verdicts.length)];
  const score =
    randomVerdict === "likely_true"
      ? 75 + Math.floor(Math.random() * 25)
      : randomVerdict === "likely_false"
      ? Math.floor(Math.random() * 35)
      : 40 + Math.floor(Math.random() * 30);

  return {
    credibilityScore: score,
    verdict: randomVerdict,
    summary:
      randomVerdict === "likely_true"
        ? "This content appears to be largely accurate based on our analysis. The claims made are consistent with verified sources and factual data."
        : randomVerdict === "likely_false"
        ? "This content contains multiple red flags and unverified claims. Key assertions contradict established facts from reliable sources."
        : "This content contains a mix of accurate and unverified information. Some claims require additional verification from primary sources.",
    keyFindings: [
      randomVerdict === "likely_true"
        ? "Primary claims are supported by multiple credible sources"
        : "Several claims lack verifiable sources",
      inputType === "url"
        ? "Source domain has mixed credibility history"
        : "Language patterns suggest potential bias",
      randomVerdict === "likely_false"
        ? "Key statistics appear to be fabricated or misrepresented"
        : "Factual statements are mostly accurate",
      "No signs of AI-generated manipulation detected",
      randomVerdict === "uncertain"
        ? "Additional context needed for complete verification"
        : "Cross-referenced with fact-checking databases",
    ],
    sources: [
      { name: "Reuters Fact Check", url: "https://reuters.com", reliability: "High" },
      { name: "Snopes", url: "https://snopes.com", reliability: "High" },
      { name: "Associated Press", url: "https://ap.com", reliability: "High" },
    ],
  };
};

export default function Detect() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState<ChatHistory[]>(mockHistory);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewChat = () => {
    setActiveChat(null);
    setMessages([]);
  };

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
    // In a real app, load messages for this chat
    setMessages([]);
  };

  const handleDeleteChat = (id: string) => {
    setHistory(history.filter((h) => h.id !== id));
    if (activeChat === id) {
      handleNewChat();
    }
  };

  const handleSubmit = async (content: string, mode: InputMode, file?: File) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      inputType: mode,
      content,
      imageUrl: file ? URL.createObjectURL(file) : undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI analysis
    setTimeout(() => {
      const analysis = generateMockAnalysis(mode);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "",
        analysis,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);

      // Add to history if new chat
      if (!activeChat) {
        const newHistoryItem: ChatHistory = {
          id: Date.now().toString(),
          title: content.slice(0, 40) + (content.length > 40 ? "..." : ""),
          date: "Today",
          type: mode,
        };
        setHistory((prev) => [newHistoryItem, ...prev]);
        setActiveChat(newHistoryItem.id);
      }
    }, 2000);
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        history={history}
        activeId={activeChat}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="h-8 w-8"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            )}
            <h1 className="font-semibold text-lg hidden sm:block">
              {activeChat ? "Analysis" : "New Analysis"}
            </h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Messages Area */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="max-w-4xl mx-auto p-4 space-y-6">
            {messages.length === 0 ? (
              <EmptyState />
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
            {isLoading && <LoadingState />}
          </div>
        </ScrollArea>

        {/* Input */}
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6 animate-pulse-glow">
        <Shield className="h-10 w-10 text-primary-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">
        Welcome to <span className="text-gradient">fyp25098</span>
      </h2>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
        <Shield className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="glass-strong rounded-2xl rounded-tl-md px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-sm text-muted-foreground">Analyzing content...</span>
        </div>
      </div>
    </div>
  );
}
