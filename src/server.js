import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Routes
// import todoRoutes from "./presentation/routes/todo.routes.js";
import usersRoutes from "./presentation/routes/users.routes.js";
import projectsRoutes from "./presentation/routes/projects.routes.js";
import issuesRoutes from "./presentation/routes/issues.routes.js";
import commentsRoutes from "./presentation/routes/comments.routes.js";
import sprintsRoutes from "./presentation/routes/sprints.routes.js";
import boardsRoutes from "./presentation/routes/boards.routes.js";
import issueTypesRoutes from "./presentation/routes/issueTypes.routes.js";
import statusTypesRoutes from "./presentation/routes/statusTypes.routes.js";
import priorityTypesRoutes from "./presentation/routes/priorityTypes.routes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from src/public
// app.use("/api/todos", todoRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/issues", issuesRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/sprints", sprintsRoutes);
app.use("/api/boards", boardsRoutes);
app.use("/api/issue-types", issueTypesRoutes);
app.use("/api/status-types", statusTypesRoutes);
app.use("/api/priority-types", priorityTypesRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Todo App API",
    version: "1.0.0",
    endpoints: {
      // todos: "/api/todos",
      users: "/api/users",
      projects: "/api/projects",
      issues: "/api/issues",
      comments: "/api/comments",
      sprints: "/api/sprints",
      boards: "/api/boards",
      issueTypes: "/api/issue-types",
      statusTypes: "/api/status-types",
      priorityTypes: "/api/priority-types",
    },
  });
});

// handle 404 for unknown routes
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
});

// global error handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});