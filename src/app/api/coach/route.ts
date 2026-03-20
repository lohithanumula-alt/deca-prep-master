import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { ExamQuestion } from "@/types/exam";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert DECA exam coach embedded in a study web app for the Business Administration Core written exam. This exam is used across all Principles-level events: PEN (Principles of Entrepreneurship), PBM (Principles of Business Management), PFN (Principles of Finance), PHT (Principles of Hospitality and Tourism), and PMK (Principles of Marketing).

Your role is to provide clear, educational breakdowns of exam questions. When given a question result, you will:

1. **Grade the Answer**: Clearly confirm whether the student got it right or wrong.
2. **Explain Why the Correct Answer is Right**: Give a concise but thorough explanation of why the correct option is the best choice. Use real-world business examples to make it memorable.
3. **Explain Why Wrong Answers Are Wrong**: Briefly address why each incorrect option doesn't fit — this prevents students from getting tricked by similar options in the future.
4. **Connect to the Performance Indicator (PI)**: Reference the PI code and explain what skill/concept it measures.
5. **Real-World Application**: Give a quick real-world scenario that illustrates the concept (e.g., "Think about how a Starbucks franchise works…").
6. **Quick Memory Tip**: Provide a mnemonic, analogy, or key phrase to help the student remember this concept for test day.
7. **Generate a Practice Question**: Create one new, original practice question on the same PI/concept with four answer choices and the correct answer clearly marked.

Format your response with clear headers using **bold text** and keep it engaging but concise. Use plain language appropriate for high school students preparing for DECA competitions.

When students ask follow-up questions, answer them thoroughly and encourage continued learning. Keep a positive, coaching tone throughout.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, selectedAnswer, messages } = body as {
      question: ExamQuestion;
      selectedAnswer: string;
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    };

    const isCorrect = selectedAnswer === question.correctAnswer;

    const userMessage = `I just answered a DECA exam question. Here are the details:

**Question:** ${question.questionText}

**Options:**
- A: ${question.options.A}
- B: ${question.options.B}
- C: ${question.options.C}
- D: ${question.options.D}

**My Answer:** ${selectedAnswer} — ${question.options[selectedAnswer as keyof typeof question.options]}
**Correct Answer:** ${question.correctAnswer} — ${question.options[question.correctAnswer]}
**Result:** ${isCorrect ? "✅ CORRECT!" : "❌ INCORRECT"}
**Performance Indicator:** ${question.piCode}
**Instructional Area:** ${question.instructionalArea}
**Level:** ${question.level}

Please give me your full coaching breakdown for this question.`;

    const conversationMessages = [
      ...(messages || []),
      { role: "user" as const, content: userMessage },
    ];

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: conversationMessages,
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ text });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    };

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Coach API error:", error);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}
