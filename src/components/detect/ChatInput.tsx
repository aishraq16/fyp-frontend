import { useState, useRef } from "react";
import { FileText, Link2, Image, Send, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InputMode = "text" | "url" | "image";

interface ChatInputProps {
  onSubmit: (content: string, mode: InputMode, file?: File) => void;
  isLoading: boolean;
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [mode, setMode] = useState<InputMode>("text");
  const [textContent, setTextContent] = useState("");
  const [urlContent, setUrlContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (isLoading) return;

    if (mode === "text" && textContent.trim()) {
      onSubmit(textContent.trim(), mode);
      setTextContent("");
    } else if (mode === "url" && urlContent.trim()) {
      onSubmit(urlContent.trim(), mode);
      setUrlContent("");
    } else if (mode === "image" && selectedFile) {
      onSubmit(selectedFile.name, mode, selectedFile);
      handleRemoveFile();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const modes = [
    { id: "text" as InputMode, icon: FileText, label: "Text" },
    { id: "url" as InputMode, icon: Link2, label: "URL" },
    { id: "image" as InputMode, icon: Image, label: "Image" },
  ];

  const canSubmit =
    !isLoading &&
    ((mode === "text" && textContent.trim()) ||
      (mode === "url" && urlContent.trim()) ||
      (mode === "image" && selectedFile));

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur-sm p-4">
      <div className="max-w-3xl mx-auto">
        {/* Mode Selector */}
        <div className="flex items-center gap-2 mb-3">
          {modes.map((m) => (
            <Button
              key={m.id}
              variant={mode === m.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode(m.id)}
              className={cn(
                "gap-2",
                mode === m.id && "gradient-primary text-primary-foreground"
              )}
            >
              <m.icon className="h-4 w-4" />
              {m.label}
            </Button>
          ))}
        </div>

        {/* Input Area */}
        <div className="glass rounded-xl p-3">
          {mode === "text" && (
            <Textarea
              placeholder="Paste an article, social media post, or any text you want to verify..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[100px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              disabled={isLoading}
            />
          )}

          {mode === "url" && (
            <Input
              type="url"
              placeholder="Enter a URL to analyze (e.g., https://example.com/article)"
              value={urlContent}
              onChange={(e) => setUrlContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isLoading}
            />
          )}

          {mode === "image" && (
            <div>
              {selectedFile ? (
                <div className="relative inline-block">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Selected"
                      className="max-h-40 rounded-lg object-cover"
                    />
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end mt-3">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="gradient-primary text-primary-foreground hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
