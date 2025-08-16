import Express, { Request, Response, NextFunction } from "express";
import { v4 } from "uuid";
export const router = Express.Router();
import { LanggraphService } from "../services/langgraph.service";
import { RedisService } from "../services/redis.service";
const handlePostAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { questionID, userAnswer } = req.body;
    if (!questionID || !userAnswer) {
      return res
        .status(400)
        .json({ error: "Query and User Answer is required" });
    }
    const thread_id = req.cookies?.thread_id || v4();
    if (!req.cookies?.thread_id) {
      res.cookie("thread_id", thread_id, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    const service = await LanggraphService.getInstance();
    const response = await service.getSuggestionResponse(
      questionID,
      userAnswer,
      thread_id
    );
    return res.json(response);
  } catch (error) {
    console.error("Error in handlePostAnswer:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetNextQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const thread_id = req.cookies?.thread_id || v4();
  if (!req.cookies?.thread_id) {
    res.cookie("thread_id", thread_id, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
  const redisService = await RedisService.getInstance();
  const redisClient = await redisService.getClient();
  const visitedQuestions =
    (await redisClient.sMembers(`questions:${thread_id}`)) || [];
  const service = await LanggraphService.getInstance();
  const nextQuestion = await service.getNextQuestion(
    visitedQuestions,
    thread_id
  );
  if (!nextQuestion) {
    return res.status(404).json({ error: "No more questions available" });
  }
  return res.json(nextQuestion);
};

router.post("/answer", handlePostAnswer);
router.get("/next", handleGetNextQuestion);
