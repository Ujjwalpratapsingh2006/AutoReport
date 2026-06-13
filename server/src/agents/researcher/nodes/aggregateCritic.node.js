// CAP: Maximum 2 revision rounds to limit LLM calls
const MAX_REVISIONS = 2;

export async function aggregateCriticNode(state) {
    console.log("--- AGGREGATE CRITIC NODE ---");
    const { peerReviews, revisionCount } = state;

    // Get the latest round of reviews (should be 3)
    const latestReviews = peerReviews.slice(-3);
    
    // Calculate exact mathematical average
    const totalScore = latestReviews.reduce((sum, r) => sum + r.score, 0);
    const avgScore = totalScore / latestReviews.length;
    // Round to 1 decimal place
    const roundedScore = Math.round(avgScore * 10) / 10;

    // Compile the Strike-list
    const compiledFeedback = latestReviews.map(r => `[${r.persona} Score: ${r.score}/10]:\n${r.feedback}`).join("\n\n");

    // Check Max Revisions
    let maxRevisionsReached = false;
    let action = roundedScore >= 7 ? "accepted" : "revision requested";

    if (revisionCount >= MAX_REVISIONS && roundedScore < 7) {
        console.log(`-> Max revisions reached. Final score stays at ${roundedScore}/10.`);
        maxRevisionsReached = true;
        action = "max retries reached";
    }

    console.log(`-> Aggregate Critic score: ${roundedScore}/10 — ${action}`);

    return {
        criticScore: roundedScore,
        criticFeedback: compiledFeedback,
        revisionCount: revisionCount + 1,
        maxRevisionsReached: maxRevisionsReached,
        // Send a reset signal to clear peerReviews for the next loop (if any)
        peerReviews: [{ reset: true }],
        nodeLog: [{ node: "critic", status: "completed", data: {
            score: roundedScore, action, feedback: "Aggregate peer review completed."
        }}]
    };
}
