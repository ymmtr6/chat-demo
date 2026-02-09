"use client";

import { useState, useCallback, useRef } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import SettingsModal from "@/components/SettingsModal";
import {
  conversations as initialConversations,
  messagesByConversation as initialMessages,
} from "@/lib/mock-data";
import type {
  Conversation,
  Message,
  ProfileAttribute,
  ChatMessage,
  ChatRequest,
  ChatResponse,
  ProfileRequest,
  ProfileResponse,
} from "@/lib/types";

const PROFILE_UPDATE_INTERVAL = 5;

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [activeId, setActiveId] = useState<string | null>(conversations[0]?.id ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileAttribute[]>([]);
  const [model, setModel] = useState("gpt-4o-mini");
  const [temperature, setTemperature] = useState(0.7);
  const messageCountRef = useRef(0);

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

  const fetchProfile = useCallback(
    async (conversationMessages: ChatMessage[]) => {
      const body: ProfileRequest = {
        messages: conversationMessages,
        currentProfile: profile,
      };

      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          const data = (await res.json()) as ProfileResponse;
          setProfile(data.attributes);
        }
      } catch {
        // プロファイル更新失敗はサイレントに無視
      }
    },
    [profile],
  );

  const handleSend = useCallback(
    async (content: string) => {
      if (!activeId) return;

      const userMessage: Message = {
        id: `${activeId}-${Date.now()}`,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };

      const updatedMessages = [...(messages[activeId] ?? []), userMessage];

      setMessages((prev) => ({
        ...prev,
        [activeId]: updatedMessages,
      }));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId && c.title === "新しい会話"
            ? { ...c, title: content.slice(0, 30) }
            : c,
        ),
      );

      setIsLoading(true);

      const chatMessages: ChatMessage[] = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const body: ChatRequest = {
        conversationId: activeId,
        messages: chatMessages,
        profile: profile.length > 0 ? profile : undefined,
        config: { model, temperature },
      };

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "APIエラーが発生しました");
        }

        const data = (await res.json()) as ChatResponse;

        const assistantMessage: Message = {
          id: `${activeId}-${Date.now()}-resp`,
          role: "assistant",
          content: data.message.content,
          createdAt: new Date().toISOString(),
        };

        const allMessages = [...updatedMessages, assistantMessage];

        setMessages((prev) => ({
          ...prev,
          [activeId]: allMessages,
        }));

        // プロファイル更新（N件ごと）
        messageCountRef.current += 1;
        if (messageCountRef.current % PROFILE_UPDATE_INTERVAL === 0) {
          const profileMessages: ChatMessage[] = allMessages.map((m) => ({
            role: m.role,
            content: m.content,
          }));
          fetchProfile(profileMessages);
        }
      } catch (err) {
        const errorContent =
          err instanceof Error ? err.message : "エラーが発生しました";
        const errorMessage: Message = {
          id: `${activeId}-${Date.now()}-err`,
          role: "assistant",
          content: `⚠ ${errorContent}`,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => ({
          ...prev,
          [activeId]: [...updatedMessages, errorMessage],
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [activeId, messages, profile, model, temperature, fetchProfile],
  );

  const handleDeleteProfileAttribute = useCallback((key: string) => {
    setProfile((prev) => prev.filter((a) => a.key !== key));
  }, []);

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
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onDeleteProfileAttribute={handleDeleteProfileAttribute}
        model={model}
        onModelChange={setModel}
        temperature={temperature}
        onTemperatureChange={setTemperature}
      />
    </div>
  );
}
