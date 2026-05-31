import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";


const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

import authRoutes from "./routes/authRoutes";
import farmerRoutes from "./routes/farmerRoutes";
import waterRoutes from "./routes/waterRoutes";


app.use("/api/auth", authRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/water", waterRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API Running",
  });
});

export default app;