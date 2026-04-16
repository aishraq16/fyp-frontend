import { FileText, Link2, Image, AlertTriangle, CheckCircle, HelpCircle, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
  inputType?: "text" | "url" | "image";
  content: string;
  imageUrl?: string;
  analysis?: AnalysisResult;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.type === "user") {
    return <UserMessage message={message} />;
  }
  return <AssistantMessage message={message} />;
}

function UserMessage({ message }: { message: Message }) {
  const inputIcons = {
    text: FileText,
    url: Link2,
    image: Image,
  };
  const Icon = message.inputType ? inputIcons[message.inputType] : FileText;

  return (
    <div className="flex justify-end animate-fade-in">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 mb-2 justify-end">
          <Badge variant="secondary" className="text-xs">
            <Icon className="h-3 w-3 mr-1" />
            {message.inputType === "text" && "Text Analysis"}
            {message.inputType === "url" && "URL Scan"}
            {message.inputType === "image" && "Image Check"}
          </Badge>
        </div>
        <div className="glass-strong rounded-2xl rounded-tr-md px-4 py-3">
          {message.imageUrl && (
            <img
              src={message.imageUrl}
              alt="Uploaded"
              className="max-h-48 rounded-lg mb-2 object-cover"
            />
          )}
          <p className="text-sm leading-relaxed">
            {message.inputType === "url" ? (
              <a
                href={message.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {message.content}
              </a>
            ) : (
              message.content
            )}
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

function AssistantMessage({ message }: { message: Message }) {
  const { analysis } = message;

  if (!analysis) {
    return (
      <div className="flex animate-fade-in">
        <div className="glass-strong rounded-2xl rounded-tl-md px-4 py-3 max-w-2xl">
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    );
  }

  const verdictConfig = {
    likely_true: {
      icon: CheckCircle,
      label: "Likely Authentic",
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/30",
    },
    likely_false: {
      icon: AlertTriangle,
      label: "Likely False",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/30",
    },
    uncertain: {
      icon: HelpCircle,
      label: "Uncertain",
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/30",
    },
  };

  const verdict = verdictConfig[analysis.verdict];
  const VerdictIcon = verdict.icon;

  return (
    <div className="flex animate-fade-in">
      <div className="max-w-3xl w-full space-y-4">
        {/* Verdict Card */}
        <Card className={cn("glass-strong border", verdict.borderColor)}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", verdict.bgColor)}>
                  <VerdictIcon className={cn("h-5 w-5", verdict.color)} />
                </div>
                <div>
                  <CardTitle className={cn("text-lg", verdict.color)}>
                    {verdict.label}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Credibility Score: {analysis.credibilityScore}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{analysis.credibilityScore}</div>
                <div className="text-xs text-muted-foreground">/ 100</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress
              value={analysis.credibilityScore}
              className="h-2"
            />
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="glass-strong">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.summary}
            </p>
          </CardContent>
        </Card>

        {/* Key Findings */}
        <Card className="glass-strong">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Key Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{finding}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Sources */}
        {analysis.sources.length > 0 && (
          <Card className="glass-strong">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Verified Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      <span className="text-sm">{source.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {source.reliability}
                    </Badge>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}
