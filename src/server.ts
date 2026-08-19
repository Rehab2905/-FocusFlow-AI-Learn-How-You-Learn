import express from "express";
import cors from "cors";

import { env } from "./config/env.js";

import chatRouter
  from "./routes/chat.js";

import conversationsRouter
  from "./routes/conversations.js";

import tasksRouter
  from "./routes/tasks.js";

import moodRouter
  from "./routes/mood.js";

import profileRouter
  from "./routes/profile.js";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true
  })
);

app.use(express.json());

app.get(
  "/",
  (_req, res) => {
    res.json({
      name: "FocusFlow AI Backend",
      status: "running"
    });
  }
);

app.get(
  "/health",
  (_req, res) => {
    res.json({
      status: "ok"
    });
  }
);

app.use(
  "/api/chat",
  chatRouter
);

app.use(
  "/api/conversations",
  conversationsRouter
);

app.use(
  "/api/tasks",
  tasksRouter
);

app.use(
  "/api/mood",
  moodRouter
);

app.use(
  "/api/profile",
  profileRouter
);

app.listen(
  env.port,
  () => {

    console.log(
      `FocusFlow Backend running on port ${env.port}`
    );

  }
);
