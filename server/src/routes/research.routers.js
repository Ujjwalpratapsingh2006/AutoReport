import express from "express";
import { startResearch, approvePlan, streamResearch, getSessions, getSession } from "../controllers/research.controllers.js";
import ensureAuthentication from "../middlewares/ensureAuth.middleware.js";

const router = express.Router();

router.use(ensureAuthentication);

router.post("/start", startResearch);
router.post("/:sessionId/approve", approvePlan);
router.get("/stream/:sessionId", streamResearch);
router.get("/sessions", getSessions);
router.get("/sessions/:sessionId", getSession);

export default router;
