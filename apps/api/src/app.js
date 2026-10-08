import env from "./config/env.config.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan((tokens, req, res) => [
  tokens.method(req, res),
  req.originalUrl.split("?")[0],
  tokens.status(req, res),
  `${tokens["response-time"](req, res)} ms`,
].join(" ")));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
