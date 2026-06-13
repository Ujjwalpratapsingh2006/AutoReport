import { llm } from "../../../services/llm.js";

export async function writeNode(state) {
    console.log("--- WRITE NODE ---");
    const { topic, searchResults, sources, criticFeedback, revisionCount } = state;

    // Build source references for citation
    const sourceRefs = sources.map((s, idx) => `[${idx + 1}] ${s.title} - ${s.url}`).join("\n");
    
    // Combine all search content
    const allContent = searchResults.map(r => {
        return `Query: ${r.query}\n${r.content}`;
    }).join("\n\n---\n\n");

    // If this is a revision, include the critic's feedback
    let revisionInstruction = "";
    if (criticFeedback && revisionCount > 0) {
        revisionInstruction = `
    
    ⚠️ IMPORTANT — REVISION ${revisionCount}: A reviewer gave this feedback on your previous draft:
    "${criticFeedback}"
    
    You MUST address ALL of this feedback in your revised report. Improve the areas mentioned.`;
    }

    const prompt = `You are a Principal Research Analyst at a top-tier intelligence firm. Write an exhaustive, highly-detailed academic research report on the topic: "${topic}".
    
    Use the following gathered intelligence from parallel searches to write your report. Synthesize the overlapping information and highlight any contradictions or nuanced perspectives.
    
    ${allContent}
    
    CRITICAL REQUIREMENTS:
    1. **Depth over Breadth**: Do not just list facts. Explain the "why" and "how". Analyze the implications, history, and underlying mechanisms of the topic.
    2. **Structure**: 
        - # Main Title
        - ## Executive Summary (High-level synthesis)
        - ## Detailed Sections (Break down the topic comprehensively using ### sub-headers)
        - ## Critical Analysis & Future Outlook
    3. **Citations**: You MUST use strict academic inline citations like [1], [2] referencing the source index whenever you state a fact, data point, or claim. Do NOT add a bibliography or "Sources" section at the end of the report.
    4. **Length**: The report should be highly detailed (aim for 1000-2000 words if there is enough context).
    
    Write with an authoritative, analytical tone.${revisionInstruction}`;

    const response = await llm.invoke(prompt);
    
    console.log(`-> Report generated (revision ${revisionCount}). Length: ${response.content.length} chars.`);

    return {
        report: response.content,
        nodeLog: [{ node: "write", status: "completed", data: { 
            reportLength: response.content.length, 
            sourceCount: sources.length,
            revision: revisionCount 
        }}]
    };
}
