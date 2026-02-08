"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/lib/mock-data";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

type ChatAreaProps = {
  messages: Message[];
  onSend: (content: string) => void;
  isLoading: boolean;
};

export default function ChatArea({ messages, onSend, isLoading }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center pt-32 text-gray-400 dark:text-gray-500">
              <p>メッセージを送信して会話を始めましょう</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-gray-100 px-4 py-2.5 text-sm text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                <span className="animate-pulse">考え中...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <ChatInput onSend={onSend} disabled={isLoading} />
    </div>
  );
}
