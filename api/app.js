require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware array
const middleware = [
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  cors(),
];

app.use(middleware);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const apiRoutes = require("./routes/api/api.routes");

// API routes
app.use("/api", apiRoutes);
