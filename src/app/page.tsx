"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import SettingsModal from "@/components/SettingsModal";
import {
  conversations as initialConversations,
  messagesByConversation as initialMessages,
  getRandomMockResponse,
  Conversation,
  Message,
} from "@/lib/mock-data";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [activeId, setActiveId] = useState<string | null>(conversations[0]?.id ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const activeMessages = activeId ? messages[activeId] ?? [] : [];

  const handleSelectConversation = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const handleNewChat = useCallback(() => {
    const newId = String(Date.now());
    const newConv: Conversation = {
      id: newId,
      title: "新しい会話",
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setMessages((prev) => ({ ...prev, [newId]: [] }));
    setActiveId(newId);
  }, []);

  const handleSend = useCallback(
    (content: string) => {
      if (!activeId) return;

      const userMessage: Message = {
        id: `${activeId}-${Date.now()}`,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] ?? []), userMessage],
      }));

      // 会話タイトルが「新しい会話」なら最初のメッセージで更新
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId && c.title === "新しい会話"
            ? { ...c, title: content.slice(0, 30) }
            : c
        )
      );

      setIsLoading(true);

      setTimeout(() => {
        const assistantMessage: Message = {
          id: `${activeId}-${Date.now()}-resp`,
          role: "assistant",
          content: getRandomMockResponse(),
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => ({
          ...prev,
          [activeId]: [...(prev[activeId] ?? []), assistantMessage],
        }));
        setIsLoading(false);
      }, 1000);
    },
    [activeId]
  );

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        <ChatArea
          messages={activeMessages}
          onSend={handleSend}
          isLoading={isLoading}
        />
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
