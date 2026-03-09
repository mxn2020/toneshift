import { action } from "./_generated/server";
import { v } from "convex/values";

const TONE_PROMPTS: Record<string, string> = {
    professional: "Rewrite in a polished, professional business tone.",
    casual: "Rewrite in a relaxed, casual conversational tone.",
    friendly: "Rewrite in a warm, friendly, approachable tone.",
    assertive: "Rewrite in a confident, direct, assertive tone.",
    empathetic: "Rewrite with empathy and emotional awareness.",
    humorous: "Rewrite with humor — be witty and lighthearted.",
    diplomatic: "Rewrite diplomatically — tactful and balanced.",
    confident: "Rewrite with strong confidence and authority.",
    apologetic: "Rewrite as a sincere, genuine apology.",
    enthusiastic: "Rewrite with genuine enthusiasm and energy.",
    formal: "Rewrite in a formal, dignified, traditional tone.",
    gen_z: "Rewrite in Gen Z internet language — no cap, fr fr, slay.",
};

export const rewrite = action({
    args: { text: v.string(), targetTone: v.string() },
    handler: async (_ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
        const toneInstruction = TONE_PROMPTS[args.targetTone] || TONE_PROMPTS.professional;
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: `You are ToneShift, an expert at rewriting messages in different tones while preserving the original meaning. ${toneInstruction} Output ONLY the rewritten text, nothing else.` },
                    { role: "user", content: args.text },
                ],
                temperature: 0.7, max_tokens: 2000,
            }),
        });
        if (!response.ok) throw new Error(`OpenAI error: ${await response.text()}`);
        const data = (await response.json()) as any;
        return { rewrittenText: data.choices?.[0]?.message?.content?.trim() || "" };
    },
});
