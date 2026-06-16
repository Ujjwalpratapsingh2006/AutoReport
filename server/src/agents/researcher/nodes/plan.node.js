import { z } from "zod";
import { llm } from "../../../services/llm.js";

// CAP: Maximum 4 sub-questions to limit total Tavily API calls
const MAX_SUB_QUESTIONS = 4;

export async function planNode(state) {
    console.log("--- PLAN NODE ---");
    const { topic } = state;

    const planSchema = z.object({
        questions: z.array(z.string()).describe(`An array of 3 to ${MAX_SUB_QUESTIONS} specific, targeted sub-questions to research the topic comprehensively.`)
    });

    const structuredLlm = llm.withStructuredOutput(planSchema);

    const prompt = `You are an expert research planner. The user wants to research the following topic:
    Topic: "${topic}"
    
    Create a highly focused research plan by breaking this topic down into 3 to ${MAX_SUB_QUESTIONS} specific sub-questions.
    These questions should cover the most important aspects of the topic and be highly searchable on the web.
    Return EXACTLY 3 to ${MAX_SUB_QUESTIONS} questions — no more.`;

    const result = await structuredLlm.invoke(prompt);
    
    // Enforce the cap even if LLM returns more
    const questions = result.questions.slice(0, MAX_SUB_QUESTIONS);
    console.log(`-> Planned ${questions.length} sub-questions.`);

    return {
        researchPlan: questions,
        nodeLog: [{ node: "plan", status: "completed", data: { questions } }]
    };
}
