import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import messageRoute from "./routes/messages";
import "dotenv/config";
import "./database/db";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000" || "https://hashit.xyz",
    credentials: true,
    optionsSuccessStatus: 200 || 204,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
