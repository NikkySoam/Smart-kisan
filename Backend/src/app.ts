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
import dashboardRoutes from "./routes/dashboardRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import reportRoutes from "./routes/reportRoutes";
import fertilizerRoutes from "./routes/fertilizerRoutes";
import fieldRoutes from "./routes/fieldRoutes";
import fieldWaterRoutes from "./routes/fieldWaterRoutes";




app.use("/api/auth", authRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings",settingsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/fertilizers",fertilizerRoutes);
app.use("/api/fields",fieldRoutes);
app.use("/api/field-water",fieldWaterRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API Running",
  });
});

export default app;