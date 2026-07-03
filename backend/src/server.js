const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mapsRouter = require("./routes/maps");
const structureRouter = require("./routes/structure");
const compareRoutesRouter = require("./routes/compareRoutes");
const generateTodosRouter = require("./routes/generateTodos");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Naro backend is running" });
});

app.use("/api/maps", mapsRouter);
app.use("/api/structure", structureRouter);
app.use("/api/compare-routes", compareRoutesRouter);
app.use("/api/generate-todos", generateTodosRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
