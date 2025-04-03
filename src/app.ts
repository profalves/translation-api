import express from "express";
import cors from "cors";
import config from "./config/app";
import routes from "./routes/translation.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", routes);

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
