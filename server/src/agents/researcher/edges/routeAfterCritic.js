export function routeAfterCritic(state) {
    const { criticScore, maxRevisionsReached } = state;

    if (criticScore >= 7 || maxRevisionsReached) {
        console.log(`-> Routing: Critic accepted or max revisions reached. Finishing.`);
        return "finish";
    }

    console.log(`-> Routing: Critic rejected (${criticScore}/10). Sending back for revision.`);
    return "revise";
}
