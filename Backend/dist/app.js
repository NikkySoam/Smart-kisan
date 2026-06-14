"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const farmerRoutes_1 = __importDefault(require("./routes/farmerRoutes"));
const waterRoutes_1 = __importDefault(require("./routes/waterRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const fertilizerRoutes_1 = __importDefault(require("./routes/fertilizerRoutes"));
const fieldRoutes_1 = __importDefault(require("./routes/fieldRoutes"));
const fieldWaterRoutes_1 = __importDefault(require("./routes/fieldWaterRoutes"));
const labourRoutes_1 = __importDefault(require("./routes/labourRoutes"));
const equipmentRoutes_1 = __importDefault(require("./routes/equipmentRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const reminderRoutes_1 = __importDefault(require("./routes/reminderRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/farmers", farmerRoutes_1.default);
app.use("/api/water", waterRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
app.use("/api/settings", settingsRoutes_1.default);
app.use("/api/reports", reportRoutes_1.default);
app.use("/api/fertilizers", fertilizerRoutes_1.default);
app.use("/api/fields", fieldRoutes_1.default);
app.use("/api/field-water", fieldWaterRoutes_1.default);
app.use("/api/labour", labourRoutes_1.default);
app.use("/api/equipment", equipmentRoutes_1.default);
app.use("/api/notifications", notificationRoutes_1.default);
app.use("/api/reminders", reminderRoutes_1.default);
app.use("/api/ai", aiRoutes_1.default);
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
    });
});
exports.default = app;
