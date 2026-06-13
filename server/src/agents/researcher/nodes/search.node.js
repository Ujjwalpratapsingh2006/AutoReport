import { tavily } from "@tavily/core";

export async function searchNode(state) {
    // Read query from Send() dispatch (parallel execution)
    const query = state.currentSearchQuery;
    console.log(`--- SEARCH NODE --- "${query}"`);

    let searchResult = { query, sources: [], content: "" };

    try {
        const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
        const results = await tvly.search(query, { 
            maxResults: 5, 
            searchDepth: "advanced", 
            includeAnswer: true 
        });

        if (results.results && results.results.length > 0) {
            const sources = results.results.map(r => ({ url: r.url, title: r.title }));
            
            // Combine the comprehensive AI answer with the raw snippets
            let content = "";
            if (results.answer) {
                content += `[COMPREHENSIVE SUMMARY]:\n${results.answer}\n\n`;
            }
            content += results.results.map(r => `[Source: ${r.url}]\n${r.content}`).join("\n\n");
            
            searchResult = { query, sources, content };
            console.log(`-> Found ${sources.length} sources.`);
        } else {
            console.log("-> No results found.");
        }
    } catch (error) {
        console.error("-> Web search error:", error.message);
    }

    return {
        searchResults: [searchResult],
        nodeLog: [{ node: "search", status: "completed", data: { query, sourceCount: searchResult.sources.length } }]
    };
}
