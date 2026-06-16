import { researcherAgent } from "../agents/researcher/graph.js";
import { planNode } from "../agents/researcher/nodes/plan.node.js";
import ResearchSession from "../models/researchSession.model.js";

const activeStreams = new Set();

export const startResearch = async (req, res) => {
    try {
        const { topic } = req.body;
        if (!topic) return res.status(400).json({ message: "Topic is required" });

        const session = await ResearchSession.create({
            userId: req.user._id,
            topic: topic,
            status: "planning"
        });

        try {
            const planResult = await planNode({ topic });
            
            await ResearchSession.findByIdAndUpdate(session._id, {
                $set: {
                    researchPlan: planResult.researchPlan,
                    status: "planning" 
                },
                $push: { nodeLog: { $each: planResult.nodeLog } }
            });

            return res.status(201).json({
                sessionId: session._id,
                researchPlan: planResult.researchPlan
            });
        } catch (planError) {
            console.error("Plan generation error:", planError);
            await ResearchSession.findByIdAndUpdate(session._id, {
                $set: { status: "failed" }
            });
            return res.status(500).json({ message: "Failed to generate research plan: " + planError.message });
        }

    } catch (error) {
        console.error("Error starting research:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const approvePlan = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { approvedPlan } = req.body;

        if (!approvedPlan || !Array.isArray(approvedPlan) || approvedPlan.length === 0) {
            return res.status(400).json({ message: "Approved plan must be a non-empty array of questions." });
        }

        const cappedPlan = approvedPlan.slice(0, 5);

        const session = await ResearchSession.findById(sessionId);
        if (!session) return res.status(404).json({ message: "Session not found" });
        if (session.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });
        if (session.status !== "planning") return res.status(400).json({ message: "Session is not awaiting approval." });

        await ResearchSession.findByIdAndUpdate(sessionId, {
            $set: {
                researchPlan: cappedPlan,
                status: "approved"
            },
            $push: {
                nodeLog: { node: "human", status: "completed", data: { action: "plan_approved", questionCount: cappedPlan.length } }
            }
        });

        return res.status(200).json({ message: "Plan approved", researchPlan: cappedPlan });
    } catch (error) {
        console.error("Approve error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const streamResearch = async (req, res) => {
    const { sessionId } = req.params;

    try {
        const session = await ResearchSession.findById(sessionId);
        if (!session) return res.status(404).json({ message: "Session not found" });

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        const sendEvent = (event, data) => {
            res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        };

        if (session.status === "completed" || session.status === "failed") {
            sendEvent("complete", { session });
            res.end();
            return;
        }

        if (session.status !== "approved") {
            sendEvent("error", { message: `Cannot stream: session status is "${session.status}", expected "approved".` });
            res.end();
            return;
        }

        if (activeStreams.has(sessionId)) {
            sendEvent("error", { message: "Research is already in progress." });
            res.end();
            return;
        }

        activeStreams.add(sessionId);

        await ResearchSession.findByIdAndUpdate(sessionId, { $set: { status: "running" } });

        const collectedNodeLogs = [];

        try {
            
            const initialState = {
                topic: session.topic,
                researchPlan: session.researchPlan, 
            };

            const stream = await researcherAgent.stream(initialState);
            let finalState = null;

            for await (const output of stream) {
                for (const [nodeName, stateUpdate] of Object.entries(output)) {
                    finalState = { ...(finalState || initialState), ...stateUpdate };

                    if (stateUpdate.nodeLog) {
                        for (const log of stateUpdate.nodeLog) {
                            collectedNodeLogs.push(log);
                            sendEvent("node_update", log);
                        }
                    }
                }
            }

            const updatedSession = await ResearchSession.findByIdAndUpdate(
                sessionId,
                {
                    $set: {
                        status: "completed",
                        report: finalState.report || "",
                        sources: finalState.sources || [],
                        totalSearches: finalState.searchResults ? finalState.searchResults.length : 0,
                        criticScore: finalState.criticScore || 0,
                        criticFeedback: finalState.criticFeedback || "",
                        revisionCount: finalState.revisionCount || 0,
                    },
                    $push: { nodeLog: { $each: collectedNodeLogs } }
                },
                { new: true }
            );

            sendEvent("complete", { session: updatedSession });

        } catch (agentError) {
            console.error("Agent execution error:", agentError);
            await ResearchSession.findByIdAndUpdate(sessionId, {
                $set: { status: "failed" },
                $push: { nodeLog: { $each: collectedNodeLogs } }
            });
            sendEvent("error", { message: agentError.message || "Agent failed during execution" });
        } finally {
            activeStreams.delete(sessionId);
            res.end();
        }

    } catch (error) {
        console.error("SSE setup error:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

export const getSessions = async (req, res) => {
    try {
        const sessions = await ResearchSession.find({ userId: req.user._id })
            .select("topic createdAt status criticScore")
            .sort({ createdAt: -1 });
        return res.status(200).json(sessions);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getSession = async (req, res) => {
    try {
        const session = await ResearchSession.findById(req.params.sessionId);
        if (!session) return res.status(404).json({ message: "Session not found" });
        if (session.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });
        return res.status(200).json(session);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
