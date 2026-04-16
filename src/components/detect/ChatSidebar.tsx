import { useState } from "react";
import { Plus, Search, Clock, Trash2, MoreHorizontal, PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Logo } from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ChatHistory {
  id: string;
  title: string;
  date: string;
  type: "text" | "url" | "image";
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  history: ChatHistory[];
  activeId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

export function ChatSidebar({
  isOpen,
  onToggle,
  history,
  activeId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = history.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedHistory = {
    today: filteredHistory.filter((item) => item.date === "Today"),
    yesterday: filteredHistory.filter((item) => item.date === "Yesterday"),
    older: filteredHistory.filter(
      (item) => item.date !== "Today" && item.date !== "Yesterday"
    ),
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-50 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          isOpen ? "w-72" : "w-0 md:w-16"
        )}
      >
        {/* Header */}
        <div className={cn("p-4 flex items-center", isOpen ? "justify-between" : "justify-center")}>
          {isOpen ? (
            <>
              <Logo size="sm" />
              <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
              <PanelLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* New Chat Button */}
        <div className={cn("px-3", !isOpen && "px-2")}>
          <Button
            onClick={onNewChat}
            className={cn(
              "w-full gradient-primary text-primary-foreground hover:opacity-90",
              !isOpen && "px-0"
            )}
          >
            <Plus className="h-4 w-4" />
            {isOpen && <span className="ml-2">New Analysis</span>}
          </Button>
        </div>

        {isOpen && (
          <>
            {/* Search */}
            <div className="px-3 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-sidebar-accent border-sidebar-border"
                />
              </div>
            </div>

            {/* History */}
            <ScrollArea className="flex-1 mt-4">
              <div className="px-3 space-y-4">
                {groupedHistory.today.length > 0 && (
                  <HistoryGroup
                    title="Today"
                    items={groupedHistory.today}
                    activeId={activeId}
                    onSelect={onSelectChat}
                    onDelete={onDeleteChat}
                  />
                )}
                {groupedHistory.yesterday.length > 0 && (
                  <HistoryGroup
                    title="Yesterday"
                    items={groupedHistory.yesterday}
                    activeId={activeId}
                    onSelect={onSelectChat}
                    onDelete={onDeleteChat}
                  />
                )}
                {groupedHistory.older.length > 0 && (
                  <HistoryGroup
                    title="Previous"
                    items={groupedHistory.older}
                    activeId={activeId}
                    onSelect={onSelectChat}
                    onDelete={onDeleteChat}
                  />
                )}
              </div>
            </ScrollArea>
          </>
        )}

        {/* Footer - User */}
        <div className={cn("p-3 border-t border-sidebar-border mt-auto", !isOpen && "p-2")}>
          <Button variant="ghost" className={cn("w-full justify-start", !isOpen && "px-0 justify-center")}>
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
              J
            </div>
            {isOpen && <span className="ml-2 truncate">John Doe</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}

interface HistoryGroupProps {
  title: string;
  items: ChatHistory[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

function HistoryGroup({ title, items, activeId, onSelect, onDelete }: HistoryGroupProps) {
  return (
    <div>
      <div className="flex items-center gap-2 px-2 mb-2">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "group flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition-colors",
              activeId === item.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent/50"
            )}
            onClick={() => onSelect(item.id)}
          >
            <span className="text-sm truncate flex-1">{item.title}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
}
