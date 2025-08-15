import Express, { Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";

config();

const app = Express();
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the server!");
});

app.listen(process.env.PORT || 8080, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 8080}`
  );
});
