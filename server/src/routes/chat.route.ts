import Express, { Request, Response, NextFunction } from "express";
import { v4 } from "uuid";
export const router = Express.Router();
import { LanggraphService } from "../services/langgraph.service";
import { RedisService } from "../services/redis.service";
import { StoredMessage } from "@langchain/core/messages";
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

export const handleGetChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const thread_id = req.cookies?.thread_id;
    if (!thread_id) {
      return res.status(400).json({ error: "Thread ID is required" });
    }
    const service = await RedisService.getInstance();
    const redisClient = await service.getClient();
    const chatData = await redisClient.get(`chat:${thread_id}`);
    if (!chatData) {
      return res.status(404).json({ error: "Chat not found" });
    }
    const parsedData = JSON.parse(chatData);
    const sanitizedData = parsedData.map((msg: StoredMessage) => ({
      type: msg.type,
      data: {
        content: Array.isArray(msg.data.content)
          ? msg.data.content.find((c) => c.type === "text")?.text
          : msg.data.content,
      },
    }));
    return res.json(sanitizedData);
  } catch (error) {
    console.error("Error in handleGetChat:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

router.post("/", handlePostChat);
router.get("/", handleGetChat);
