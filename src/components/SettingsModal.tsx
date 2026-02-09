"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme-context";
import type { ProfileAttribute } from "@/lib/types";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileAttribute[];
  onDeleteProfileAttribute: (key: string) => void;
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  endpointUrl: string;
  onEndpointUrlChange: (value: string) => void;
  model: string;
  onModelChange: (value: string) => void;
  temperature: number;
  onTemperatureChange: (value: number) => void;
};

const categories = ["プロファイル", "一般", "表示", "通知", "モデル", "API"] as const;
type Category = (typeof categories)[number];

export default function SettingsModal({
  isOpen,
  onClose,
  profile,
  onDeleteProfileAttribute,
  apiKey,
  onApiKeyChange,
  endpointUrl,
  onEndpointUrlChange,
  model,
  onModelChange,
  temperature,
  onTemperatureChange,
}: SettingsModalProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("プロファイル");
  const { theme, setTheme } = useTheme();

  // ローカルのみの設定state
  const [language, setLanguage] = useState("ja");
  const [fontSize, setFontSize] = useState("medium");
  const [messageWidth, setMessageWidth] = useState("standard");
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [notificationSound, setNotificationSound] = useState(true);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeCategory) {
      case "プロファイル":
        return (
          <div className="space-y-5">
            <div>
              <p className="text-xs text-gray-500 mb-4 dark:text-gray-400">
                AIとの会話から自動的に推定された属性です。正確でない項目は削除できます。
              </p>
            </div>
            {profile.length === 0 ? (
              <div className="text-sm text-gray-400 dark:text-gray-500">
                まだプロファイルがありません。会話を続けると自動的に生成されます。
              </div>
            ) : (
              <div className="space-y-3">
                {profile.map((attr) => (
                  <div
                    key={attr.key}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">{attr.key}</div>
                      <div className="text-sm font-medium text-gray-900 truncate dark:text-gray-100">{attr.value}</div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-16 rounded-full bg-gray-200 overflow-hidden dark:bg-gray-600">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${attr.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8 text-right">
                          {Math.round(attr.confidence * 100)}%
                        </span>
                      </div>
                      <button
                        onClick={() => onDeleteProfileAttribute(attr.key)}
                        className="rounded p-1 text-gray-300 hover:bg-gray-200 hover:text-gray-500 transition-colors dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "一般":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">テーマ</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
                className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="system">ブラウザ設定</option>
                <option value="light">ライト</option>
                <option value="dark">ダーク</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">言語</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="ja">日本語</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        );

      case "表示":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">フォントサイズ</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="small">小</option>
                <option value="medium">中</option>
                <option value="large">大</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">メッセージの表示幅</label>
              <select
                value={messageWidth}
                onChange={(e) => setMessageWidth(e.target.value)}
                className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="standard">標準</option>
                <option value="wide">広い</option>
              </select>
            </div>
          </div>
        );

      case "通知":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between max-w-xs">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">通知を有効にする</label>
              <button
                onClick={() => setNotificationEnabled(!notificationEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  notificationEnabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                    notificationEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between max-w-xs">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">通知音</label>
              <button
                onClick={() => setNotificationSound(!notificationSound)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  notificationSound ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                    notificationSound ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        );

      case "モデル":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">モデル選択</label>
              <select
                value={model}
                onChange={(e) => onModelChange(e.target.value)}
                className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="gpt-4o-mini">GPT-4o mini</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4.1">GPT-4.1</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Temperature: {temperature.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                className="w-full max-w-xs"
              />
              <div className="flex justify-between text-xs text-gray-400 max-w-xs dark:text-gray-500">
                <span>0.0</span>
                <span>1.0</span>
                <span>2.0</span>
              </div>
            </div>
          </div>
        );

      case "API":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">APIキー</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder="sk-..."
                className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                未入力の場合はサーバー側の環境変数 OPENAI_API_KEY が使用されます
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">エンドポイントURL</label>
              <input
                type="text"
                value={endpointUrl}
                onChange={(e) => onEndpointUrlChange(e.target.value)}
                placeholder="https://api.openai.com/v1 (デフォルト)"
                className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="flex h-[500px] w-[700px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">設定</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ボディ: 2ペイン */}
        <div className="flex flex-1 overflow-hidden">
          {/* 左ペイン */}
          <nav className="w-40 shrink-0 border-r border-gray-200 bg-gray-50 py-2 dark:border-gray-700 dark:bg-gray-800">
            <ul className="space-y-1 px-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      activeCategory === cat
                        ? "bg-gray-200 font-medium text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* 右ペイン */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
