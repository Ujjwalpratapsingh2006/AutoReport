export async function synthesizeNode(state) {
    console.log("--- SYNTHESIZE NODE ---");
    const { searchResults } = state;

    // Deduplicate sources across all parallel search results
    const uniqueSources = new Map();
    searchResults.forEach(r => {
        r.sources.forEach(s => {
            if (!uniqueSources.has(s.url)) {
                uniqueSources.set(s.url, s);
            }
        });
    });

    const dedupedSources = Array.from(uniqueSources.values());
    console.log(`-> Merged ${searchResults.length} search results into ${dedupedSources.length} unique sources.`);

    return {
        sources: dedupedSources,
        nodeLog: [{ node: "synthesize", status: "completed", data: {
            totalResults: searchResults.length,
            uniqueSources: dedupedSources.length
        }}]
    };
}
