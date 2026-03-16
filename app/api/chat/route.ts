import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { documents } from "@/lib/documents";

// Initialize OpenAI client - will be validated in POST handler
const getOpenAIClient = () => {
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is not configured");
    }
    return new OpenAI({ apiKey });
};

export async function POST(request: NextRequest) {
    try {
        // Check API key first
        const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        if (!apiKey) {
            console.error("❌ OpenAI API key is missing in production");
            return NextResponse.json(
                { error: "Server configuration error: API key not found" },
                { status: 500 }
            );
        }

        let body;
        try {
            body = await request.json();
        } catch (parseError) {
            console.error("❌ Failed to parse request body:", parseError);
            return NextResponse.json(
                { error: "Invalid request format" },
                { status: 400 }
            );
        }

        const { question, history = [] } = body as { question?: string; history?: { role: string; content: string }[] };

        if (!question || typeof question !== "string") {
            return NextResponse.json({ error: "Question is required" }, { status: 400 });
        }

        const context = documents
            .map((doc) => `${doc.title} (${doc.type}): ${doc.content}`)
            .join("\n\n");

        const systemPrompt = `You are Amith R Sulakhe's personal portfolio AI assistant.

You have two sources of knowledge:
1. The portfolio context below about Amith (use this to answer questions about his skills, experience, education, and background).
2. The full conversation history passed to you (use this to recall and answer questions about what was previously asked or discussed in this conversation).

General tone and style:
- Always answer in a **simple, recruiter-friendly way**. Never mention "context", "knowledge base", or how you were trained.
- If something is not explicitly mentioned, give a short, positive and honest guess instead of saying you don't know. Example: "AngularJS is not his primary framework, but he's comfortable picking it up quickly since he works deeply with React and TypeScript."
- Format responses using markdown: **bold** for emphasis, bullet lists (- item) for multiple items. Use [link text](url) for any URLs so they are clickable.
- Use friendly emojis in your answers (e.g. 👋 for greeting, 📋 for lists, 🚀 for projects, ✨ for skills, 🎓 for education, 💼 for work) to make responses engaging.
- Keep answers concise and focused on how Amith is a strong candidate.

Answering specific kinds of questions:
- For questions about Amith's portfolio, skills, work, or background → answer using the portfolio context, but phrase it like a human introduction for a recruiter.
- For questions like "does Amith know Angular/AngularJS?":
  - If Angular/AngularJS is not listed, answer positively but honestly, for example:
    "AngularJS is not his main framework, but because he builds complex apps in **React, Next.js, and TypeScript**, he can adapt to Angular quickly if needed. He's open to learning it on the job. ✨"
  - Never say sentences like "The available context does not indicate..." or similar technical wording.
- For questions about the conversation itself (e.g. "what did I ask earlier?", "what was my previous question?") → look at the conversation history messages and answer from that in a friendly way.

Links (always use these exact URLs when relevant):
- If the user asks for Amith's LinkedIn, or mentions "LinkedIn profile", respond with a short line and this link: [Amith's LinkedIn](https://www.linkedin.com/in/amith-r-sulakhe-056190230/).
- If the user asks for Amith's GitHub, or mentions "GitHub profile", respond with a short line and this link: [Amith's GitHub](https://github.com/amithsulakhe).
- If they ask for "profiles" or "social links", you can mention both.

Projects formatting:
When the user asks about projects (e.g. "projects worked on", "explain projects", "what projects", "experience with projects"):
1. Write a short intro line with an emoji (e.g. "Here are the projects Amith has worked on: 📋").
2. On the next line, output exactly: PROJECTS_JSON: followed by a valid JSON array of project objects. Each object must have: "title" (string), "description" (string, can include markdown or plain text), and optionally "link" (string, full URL if known from context). Example: PROJECTS_JSON:[{"title":"Ask Ainstein","description":"AI-powered educational SaaS platform. Led frontend, integrated OpenAI APIs.","link":"https://example.com"}]
3. Do not add any text after the JSON array. Output valid JSON only for the array.

Portfolio context about Amith R Sulakhe:
${context}`;

        const conversationMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            { role: "system", content: systemPrompt },
            ...history.map((msg) => ({
                role: msg.role as "user" | "assistant" | "system",
                content: msg.content,
            })),
            { role: "user", content: question },
        ];

        const openai = getOpenAIClient();
        
        let response;
        try {
            response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: conversationMessages,
            });
        } catch (openaiError: any) {
            console.error("❌ OpenAI API call failed:", {
                message: openaiError?.message,
                status: openaiError?.status,
                code: openaiError?.code,
                type: openaiError?.type,
            });
            throw openaiError;
        }

        const aiAnswer = response.choices[0]?.message?.content ?? "";

        if (!aiAnswer) {
            console.error("❌ Empty response from OpenAI");
            return NextResponse.json(
                { error: "Received empty response from AI" },
                { status: 500 }
            );
        }

        return NextResponse.json({ answer: aiAnswer });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        // Log detailed error information for debugging
        console.error("❌ Chat API Error:", {
            message: errorMessage,
            name: error instanceof Error ? error.name : "Unknown",
            stack: errorStack,
            // Check for OpenAI-specific errors
            ...(error && typeof error === 'object' && 'status' in error ? { status: (error as any).status } : {}),
            ...(error && typeof error === 'object' && 'code' in error ? { code: (error as any).code } : {}),
        });
        
        // Return generic error to client (don't expose internal details)
        return NextResponse.json(
            { error: "Failed to process chat request" },
            { status: 500 }
        );
    }
}
