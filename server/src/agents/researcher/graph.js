import { StateGraph, END, START, Send } from "@langchain/langgraph";
import { GraphState } from "./state.js";
import { searchNode } from "./nodes/search.node.js";
import { synthesizeNode } from "./nodes/synthesize.node.js";
import { writeNode } from "./nodes/write.node.js";
import { reviewerNode } from "./nodes/reviewer.node.js";
import { aggregateCriticNode } from "./nodes/aggregateCritic.node.js";
import { routeAfterCritic } from "./edges/routeAfterCritic.js";

function fanOutToSearch(state) {
    console.log(`-> Fan-out: Dispatching ${state.researchPlan.length} parallel searches.`);
    return state.researchPlan.map((question) =>
        new Send("search", {
            topic: state.topic,
            researchPlan: state.researchPlan,
            currentSearchQuery: question,
        })
    );
}

function fanOutToReviewers(state) {
    const personas = ["Fact-Checker", "Editor", "SME"];
    console.log(`-> Fan-out: Dispatching ${personas.length} parallel peer reviewers.`);
    return personas.map((persona) => 
        new Send("reviewer", {
            ...state,
            currentReviewPersona: persona
        })
    );
}

function dispatchNode(state) {
    console.log("--- DISPATCH NODE ---");
    return {
        nodeLog: [{ node: "dispatch", status: "completed", data: { questionCount: state.researchPlan.length } }]
    };
}

const workflow = new StateGraph(GraphState)
    .addNode("dispatch", dispatchNode)
    .addNode("search", searchNode)
    .addNode("synthesize", synthesizeNode)
    .addNode("write", writeNode)
    .addNode("reviewer", reviewerNode)
    .addNode("aggregateCritic", aggregateCriticNode);

workflow.addEdge(START, "dispatch");
workflow.addConditionalEdges("dispatch", fanOutToSearch);
workflow.addEdge("search", "synthesize");
workflow.addEdge("synthesize", "write");

workflow.addConditionalEdges("write", fanOutToReviewers);

workflow.addEdge("reviewer", "aggregateCritic");

workflow.addConditionalEdges("aggregateCritic", routeAfterCritic, {
    "revise": "write",
    "finish": END
});

export const researcherAgent = workflow.compile();
