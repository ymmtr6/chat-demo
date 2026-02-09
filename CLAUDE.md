# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- `npm run dev` - 開発サーバーを起動
- `npm run build` - プロダクションビルド
- `npm start` - プロダクションサーバーを起動
- `npm run lint` - ESLintを実行

## Architecture

### プロジェクト構成

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 で構築されたチャットUIアプリケーションです。

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts     # Chat API（OpenAI APIラッパー）
│   │   └── profile/route.ts  # Profile API（会話からプロファイル抽出）
│   ├── layout.tsx      # ルートレイアウト（ThemeProviderでラップ）
│   ├── page.tsx        # メインページ（状態管理ロジックを含む）
│   └── globals.css     # グローバルスタイル（Tailwind v4構文）
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── ChatArea.tsx
│   ├── ChatInput.tsx
│   ├── MessageBubble.tsx
│   └── SettingsModal.tsx
└── lib/
    ├── types.ts           # 共通型定義（ChatMessage, ProfileAttribute等）
    ├── theme-context.tsx   # テーマ管理（light/dark/system）
    └── mock-data.ts        # モックデータ（初期会話データ）
```

### API設計

#### POST /api/chat
- OpenAI APIのラッパー。プロファイル情報をsystem promptに注入して応答をパーソナライズ
- APIキーはヘッダー `x-api-key` または環境変数 `OPENAI_API_KEY` から取得
- リクエスト: `ChatRequest`（messages, profile, config）
- レスポンス: `ChatResponse`（message）

#### POST /api/profile
- 会話履歴からユーザープロファイル属性を抽出
- OpenAI structured output（JSON Schema）を使用して型安全に取得
- リクエスト: `ProfileRequest`（messages, currentProfile）
- レスポンス: `ProfileResponse`（attributes: ProfileAttribute[]）
- 各属性は key, value, confidence (0.0-1.0) で構成

### 状態管理

- **会話・メッセージ状態**: `src/app/page.tsx` で `useState` を使用して管理
  - `conversations`: 会話リスト
  - `messages`: 会話IDごとのメッセージ
  - `activeId`: アクティブな会話ID
  - `profile`: プロファイル属性（5メッセージごとに自動更新）
- **テーマ状態**: `src/lib/theme-context.tsx` の Context API で管理
  - `light`, `dark`, `system` の3モード対応
- **設定値**: `page.tsx` で管理し、SettingsModalにpropsで渡す
  - apiKey, endpointUrl, model, temperature

### Tailwind CSS v4

- `@import "tailwindcss"` でインポート（v4構文）
- `@theme inline` でカスタムテーマ変数を定義
- ダークモードは `.dark` クラスと `@custom-variant dark` で制御

### パスエイリアス

`tsconfig.json` で `@/*` → `./src/*` のエイリアスが設定されています。

### 型定義

主要な型は `src/lib/types.ts` で定義されています：
- `ChatMessage`: チャットメッセージ（role + content）
- `Message`: ChatMessage + id + createdAt
- `Conversation`: 会話データ
- `ProfileAttribute`: プロファイル属性（key, value, confidence）
- `ChatRequest` / `ChatResponse`: Chat API用
- `ProfileRequest` / `ProfileResponse`: Profile API用
