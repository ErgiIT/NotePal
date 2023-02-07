// Web server
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const cors = require("cors");
const allowedOrigins = require("./config/allowedOrigins");

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

connectDB();

// For accepting json data from user
app.use(express.json());
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5320;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
