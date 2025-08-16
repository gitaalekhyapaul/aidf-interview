import Express, { Request, Response, NextFunction } from "express";
import { v4 } from "uuid";
export const router = Express.Router();
import { LanggraphService } from "../services/langgraph.service";
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

router.post("/answer", handlePostAnswer);
