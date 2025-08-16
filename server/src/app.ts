import Express, { Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import { MongoService } from "./services/mongodb.service";
import { LanggraphService } from "./services/langgraph.service";
import { default as cookieParser } from "cookie-parser";
import { router as chatRouter } from "./routes/chat.route";

config();

const app = Express();
app.use(cors());
app.use(Express.json());
app.use(cookieParser());

app.use("/chat", chatRouter);

Promise.all([MongoService.getInstance(), LanggraphService.getInstance()])
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(
        `Server is running on http://localhost:${process.env.PORT || 8080}`
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
