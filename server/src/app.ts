import Express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import { MongoService } from "./services/mongodb.service";
import { LanggraphService } from "./services/langgraph.service";
import { RedisService } from "./services/redis.service";
import { default as cookieParser } from "cookie-parser";
import { router as chatRouter } from "./routes/chat.route";
import { router as questionsRouter } from "./routes/questions.route";

config();

const app = Express();
app.use(cors());
app.use(Express.json());
app.use(cookieParser());

app.use("/chat", chatRouter);
app.use("/questions", questionsRouter);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

Promise.all([
  MongoService.getInstance(),
  LanggraphService.getInstance(),
  RedisService.getInstance(),
])
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(
        `[server] Server is running on http://localhost:${
          process.env.PORT || 8080
        }`
      );
    });
  })
  .catch((error) => {
    console.error("Error initializing server:", error);
  });

process.on("SIGINT", () => {
  process.exit(0);
});
process.on("SIGTERM", () => {
  process.exit(0);
});
process.on("SIGHUP", () => {
  process.exit(0);
});
