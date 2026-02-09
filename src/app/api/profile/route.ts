import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  ProfileRequest,
  ProfileResponse,
  ProfileAttribute,
} from "@/lib/types";

const PROFILE_SCHEMA = {
  name: "profile_extraction",
  strict: true,
  schema: {
    type: "object" as const,
    properties: {
      attributes: {
        type: "array" as const,
        items: {
          type: "object" as const,
          properties: {
            key: {
              type: "string" as const,
              description:
                "属性のカテゴリ名（例: 技術レベル, 主要言語, 関心領域, コミュニケーションスタイル, 好みのフレームワーク, 回答の詳細度）",
            },
            value: {
              type: "string" as const,
              description: "属性の値（例: 上級, TypeScript / Python）",
            },
            confidence: {
              type: "number" as const,
              description: "確信度 0.0〜1.0。会話内容からどの程度確信が持てるか",
            },
          },
          required: ["key", "value", "confidence"],
          additionalProperties: false,
        },
      },
    },
    required: ["attributes"],
    additionalProperties: false,
  },
} as const;

function buildProfilePrompt(
  currentProfile?: ProfileAttribute[],
): string {
  let prompt = `あなたはユーザープロファイル分析の専門家です。
会話履歴を分析し、ユーザーの属性を抽出してください。

抽出する属性の例：
- 技術レベル（初級/中級/上級）
- 主要言語（プログラミング言語）
- 関心領域（フロントエンド開発、バックエンドなど）
- コミュニケーションスタイル（簡潔・技術的、丁寧・詳細など）
- 好みのフレームワーク
- 回答の詳細度（簡潔を好む、詳細な説明を好むなど）

上記以外にも会話から読み取れる属性があれば自由に追加してください。
confidence は会話内容からどの程度確信が持てるかを 0.0〜1.0 で表します。
会話に根拠が薄い属性は含めないでください（confidence 0.3 未満は除外）。`;

  if (currentProfile && currentProfile.length > 0) {
    prompt += "\n\n現在のプロファイル（参考、必要に応じて更新してください）：\n";
    for (const attr of currentProfile) {
      prompt += `- ${attr.key}: ${attr.value} (confidence: ${attr.confidence})\n`;
    }
    prompt +=
      "\n既存の属性を更新するか、新しい属性を追加してください。会話内容と矛盾する場合は更新してください。";
  }

  return prompt;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "サーバーの環境変数 OPENAI_API_KEY が設定されていません。" },
      { status: 401 },
    );
  }

  const body = (await request.json()) as ProfileRequest;
  const { messages, currentProfile } = body;

  if (!messages || messages.length === 0) {
    return NextResponse.json(
      { error: "messages は必須です。" },
      { status: 400 },
    );
  }

  const openai = new OpenAI({ apiKey });

  const systemPrompt = buildProfilePrompt(currentProfile);

  const conversationText = messages
    .map((m) => `${m.role === "user" ? "ユーザー" : "アシスタント"}: ${m.content}`)
    .join("\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `以下の会話履歴からユーザーのプロファイルを抽出してください：\n\n${conversationText}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: PROFILE_SCHEMA,
      },
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as { attributes: ProfileAttribute[] };

    const response: ProfileResponse = {
      attributes: parsed.attributes.filter((a) => a.confidence >= 0.3),
    };

    return NextResponse.json(response);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "プロファイル分析に失敗しました";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
