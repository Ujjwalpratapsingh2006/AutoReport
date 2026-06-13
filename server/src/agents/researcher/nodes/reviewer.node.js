import { z } from "zod";
import { llm } from "../../../services/llm.js";

export async function reviewerNode(state) {
    const { report, researchPlan, sources, currentReviewPersona } = state;
    console.log(`--- REVIEWER NODE [${currentReviewPersona}] ---`);

    const reviewSchema = z.object({
        score: z.number().min(1).max(10).describe("Quality score from 1 to 10 for this specific persona"),
        feedback: z.string().describe("Specific, actionable feedback. If score is >= 8, keep it brief."),
    });

    const structuredLlm = llm.withStructuredOutput(reviewSchema);

    let personaPrompt = "";
    if (currentReviewPersona === "Fact-Checker") {
        personaPrompt = `You are a strict Fact-Checker. 
        Your ONLY job is to verify citations and factual claims. 
        Are all claims backed by the sources provided? Are there hallucinations?
        Rate the report 1-10 on FACTUAL ACCURACY.
        
        Sources provided: ${sources.length}`;
    } else if (currentReviewPersona === "Editor") {
        personaPrompt = `You are an expert Structural Editor.
        Your ONLY job is to review the markdown formatting, structure, and professional tone.
        Does it have an Executive Summary? Are there clear headers? Is it easy to read?
        Rate the report 1-10 on STRUCTURE and TONE.`;
    } else if (currentReviewPersona === "SME") {
        personaPrompt = `You are a Subject Matter Expert.
        Your ONLY job is to check if the report fully answered the original research questions.
        Original Questions:
        ${researchPlan.map((q, i) => `${i + 1}. ${q}`).join("\n")}
        
        Rate the report 1-10 on COMPLETENESS and DEPTH.`;
    }

    const prompt = `
    ${personaPrompt}
    
    Review this report:
    ${report}
    `;

    const result = await structuredLlm.invoke(prompt);
    
    console.log(`-> [${currentReviewPersona}] Score: ${result.score}/10`);

    return {
        peerReviews: [{ persona: currentReviewPersona, score: result.score, feedback: result.feedback }],
        nodeLog: [{ node: "reviewer", status: "completed", data: { persona: currentReviewPersona, score: result.score } }]
    };
}
