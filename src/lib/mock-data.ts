export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export const conversations: Conversation[] = [
  {
    id: "1",
    title: "Next.jsの始め方",
    createdAt: "2026-02-08T10:00:00Z",
  },
  {
    id: "2",
    title: "TypeScriptの型について",
    createdAt: "2026-02-07T14:30:00Z",
  },
  {
    id: "3",
    title: "Tailwind CSSのカスタマイズ",
    createdAt: "2026-02-06T09:15:00Z",
  },
  {
    id: "4",
    title: "React Hooksの使い方",
    createdAt: "2026-02-05T16:45:00Z",
  },
];

export const messagesByConversation: Record<string, Message[]> = {
  "1": [
    {
      id: "1-1",
      role: "user",
      content: "Next.jsを始めたいのですが、何から始めればいいですか？",
      createdAt: "2026-02-08T10:00:00Z",
    },
    {
      id: "1-2",
      role: "assistant",
      content:
        "Next.jsを始めるには、まず `npx create-next-app@latest` コマンドでプロジェクトを作成するのがおすすめです。App Routerを選択すると、最新のNext.jsの機能を使えます。",
      createdAt: "2026-02-08T10:00:30Z",
    },
    {
      id: "1-3",
      role: "user",
      content: "App Routerとは何ですか？",
      createdAt: "2026-02-08T10:01:00Z",
    },
    {
      id: "1-4",
      role: "assistant",
      content:
        "App Routerは Next.js 13 で導入された新しいルーティングシステムです。`app` ディレクトリ内にファイルを配置することでルーティングが自動的に設定されます。Server Components がデフォルトで使われ、パフォーマンスが向上します。",
      createdAt: "2026-02-08T10:01:30Z",
    },
  ],
  "2": [
    {
      id: "2-1",
      role: "user",
      content: "TypeScriptのジェネリクスについて教えてください。",
      createdAt: "2026-02-07T14:30:00Z",
    },
    {
      id: "2-2",
      role: "assistant",
      content:
        "ジェネリクスは、型をパラメータとして受け取る機能です。例えば `function identity<T>(arg: T): T { return arg; }` のように使います。これにより、型安全性を保ちながら柔軟なコードが書けます。",
      createdAt: "2026-02-07T14:30:30Z",
    },
    {
      id: "2-3",
      role: "user",
      content: "具体的なユースケースを教えてください。",
      createdAt: "2026-02-07T14:31:00Z",
    },
    {
      id: "2-4",
      role: "assistant",
      content:
        "代表的なユースケースとしては、APIレスポンスの型定義があります。`type ApiResponse<T> = { data: T; error: string | null; }` のように定義すると、異なるエンドポイントで共通のレスポンス型を使いながら、データ部分の型だけを変えられます。",
      createdAt: "2026-02-07T14:31:30Z",
    },
  ],
  "3": [
    {
      id: "3-1",
      role: "user",
      content: "Tailwind CSSでカスタムカラーを追加するにはどうすればいいですか？",
      createdAt: "2026-02-06T09:15:00Z",
    },
    {
      id: "3-2",
      role: "assistant",
      content:
        "Tailwind CSS v4 では、CSSファイル内で `@theme` ディレクティブを使ってカスタムカラーを定義できます。例えば `@theme { --color-brand: #3b82f6; }` と書くと、`bg-brand` や `text-brand` として使えるようになります。",
      createdAt: "2026-02-06T09:15:30Z",
    },
  ],
  "4": [
    {
      id: "4-1",
      role: "user",
      content: "useEffectの正しい使い方を教えてください。",
      createdAt: "2026-02-05T16:45:00Z",
    },
    {
      id: "4-2",
      role: "assistant",
      content:
        "useEffectは副作用を扱うためのフックです。データフェッチ、DOM操作、サブスクリプションの設定などに使います。依存配列を正しく設定することが重要で、空配列 `[]` はマウント時のみ、配列に値を入れるとその値が変わったときに実行されます。",
      createdAt: "2026-02-05T16:45:30Z",
    },
    {
      id: "4-3",
      role: "user",
      content: "クリーンアップ関数はいつ使いますか？",
      createdAt: "2026-02-05T16:46:00Z",
    },
    {
      id: "4-4",
      role: "assistant",
      content:
        "クリーンアップ関数は、コンポーネントがアンマウントされるときやエフェクトが再実行される前に呼ばれます。タイマーの解除 (`clearInterval`)、イベントリスナーの削除、WebSocket接続の切断などに使います。メモリリークを防ぐために重要です。",
      createdAt: "2026-02-05T16:46:30Z",
    },
  ],
};

const mockResponses = [
  "なるほど、良い質問ですね！詳しく説明しましょう。",
  "それについてはいくつかのアプローチがあります。まず最も一般的な方法から説明します。",
  "はい、その理解で合っています。補足すると、パフォーマンスの観点からも重要なポイントがあります。",
  "実際のプロジェクトでは、そのパターンをよく使います。具体例をお見せしましょう。",
  "素晴らしい着眼点です。その点について、もう少し深掘りしてみましょう。",
];

export function getRandomMockResponse(): string {
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
}
