import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatRequest, ChatResponse, ProfileAttribute } from "@/lib/types";

function buildSystemPrompt(profile?: ProfileAttribute[]): string {
  let prompt = "あなたは親切で知識豊富なAIアシスタントです。ユーザーの質問に丁寧に回答してください。";

  if (profile && profile.length > 0) {
    prompt += "\n\n以下はユーザーのプロファイル情報です。回答のスタイルや内容をこのプロファイルに合わせて調整してください：\n";
    for (const attr of profile) {
      prompt += `- ${attr.key}: ${attr.value} (確信度: ${Math.round(attr.confidence * 100)}%)\n`;
    }
  }

  return prompt;
}

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key") ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "APIキーが設定されていません。環境変数 OPENAI_API_KEY を設定するか、リクエストヘッダーに x-api-key を含めてください。" },
      { status: 401 },
    );
  }

  const body = (await request.json()) as ChatRequest;
  const { messages, profile, config } = body;

  if (!messages || messages.length === 0) {
    return NextResponse.json(
      { error: "messages は必須です。" },
      { status: 400 },
    );
  }

  const openai = new OpenAI({ apiKey });

  const systemPrompt = buildSystemPrompt(profile);

  try {
    const completion = await openai.chat.completions.create({
      model: config?.model ?? "gpt-4o-mini",
      temperature: config?.temperature ?? 0.7,
      messages: [
        { role: "system" as const, content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "";

    const response: ChatResponse = {
      message: { role: "assistant", content },
    };

    return NextResponse.json(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "OpenAI API呼び出しに失敗しました";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
