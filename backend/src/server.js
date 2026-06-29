const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Naro backend is running" });
});

app.post("/api/compare-routes", async (req, res) => {
  // TODO: AI 경로 비교 분석
  res.json({
    message: "compare routes API 준비 중",
    received: req.body,
  });
});

app.post("/api/generate-todos", async (req, res) => {
  // TODO: AI 할 일 생성
  res.json({
    message: "generate todos API 준비 중",
    received: req.body,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
