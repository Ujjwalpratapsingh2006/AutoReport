import { Annotation } from "@langchain/langgraph";

export const GraphState = Annotation.Root({
    topic: Annotation({
        reducer: (x, y) => y ?? x,
        default: () => "",
    }),
    researchPlan: Annotation({
        reducer: (x, y) => y ?? x,
        default: () => [],
    }),
    currentSearchQuery: Annotation({
        reducer: (x, y) => y ?? x,
        default: () => "",
    }),
    searchResults: Annotation({
        reducer: (x, y) => {
            return [...x, ...y];
        },
        default: () => [],
    }),
    report: Annotation({
        reducer: (x, y) => y ?? x,
        default: () => "",
    }),
    sources: Annotation({
        reducer: (x, y) => y ?? x,
        default: () => [],
    }),
    currentReviewPersona: Annotation({
        reducer: (x, y) => y ?? x,
        default: () => "",
    }),
    peerReviews: Annotation({
        reducer: (x, y) => {
            if (y && y.length > 0 && y[0].reset) return [];
            return [...x, ...y];
        },
        default: () => [],
    }),
    criticScore: Annotation({
        reducer: (x, y) => y ?? x,
        default: () => 0,
    }),
    criticFeedback: Annotation({
        reducer: (x, y) => y ?? x,
        default: () => "",
    }),
    revisionCount: Annotation({
        reducer: (x, y) => y ?? x,
        default: () => 0,
    }),
    maxRevisionsReached: Annotation({
        reducer: (x, y) => y ?? x,
        default: () => false,
    }),
    nodeLog: Annotation({
        reducer: (x, y) => [...x, ...y],
        default: () => [],
    }),
});
