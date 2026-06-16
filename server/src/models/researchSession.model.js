import mongoose from "mongoose";

const nodeLogSchema = new mongoose.Schema({
    node: String,
    status: {
        type: String,
        enum: ["running", "completed", "failed"]
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    data: mongoose.Schema.Types.Mixed
}, { _id: false });

const researchSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    researchPlan: [{
        type: String
    }],
    report: {
        type: String,
        default: ""
    },
    sources: [{
        url: String,
        title: String
    }],
    totalSearches: {
        type: Number,
        default: 0
    },
    criticScore: {
        type: Number,
        default: 0
    },
    criticFeedback: {
        type: String,
        default: ""
    },
    revisionCount: {
        type: Number,
        default: 0
    },
    maxRevisionsReached: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["planning", "approved", "running", "completed", "failed"],
        default: "planning"
    },
    nodeLog: [nodeLogSchema]
}, { timestamps: true });

export default mongoose.model("ResearchSession", researchSessionSchema);
