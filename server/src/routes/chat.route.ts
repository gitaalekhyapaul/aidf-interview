import Express, { Request, Response, NextFunction } from "express";
import { v4 } from "uuid";
export const router = Express.Router();
import { LanggraphService } from "../services/langgraph.service";
const handlePostChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    const thread_id = req.cookies?.thread_id || v4();
    if (!req.cookies?.thread_id) {
      res.cookie("thread_id", thread_id, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    const service = await LanggraphService.getInstance();
    const response = await service.getChatResponse(query, thread_id);
    return res.json({ response });
  } catch (error) {
    console.error("Error in handlePostChat:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

router.post("/", handlePostChat);
