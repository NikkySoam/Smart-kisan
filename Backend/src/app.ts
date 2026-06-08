import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";


const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


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
import labourRoutes from "./routes/labourRoutes";
import equipmentRoutes from "./routes/equipmentRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import reminderRoutes from "./routes/reminderRoutes";


app.use("/api/auth", authRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings",settingsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/fertilizers",fertilizerRoutes);
app.use("/api/fields",fieldRoutes);
app.use("/api/field-water",fieldWaterRoutes);
app.use("/api/labour",labourRoutes);
app.use("/api/equipment",equipmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reminders",reminderRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});


export default app;