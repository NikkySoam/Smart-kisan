"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIrrigationAdvice = void 0;
const Field_1 = __importDefault(require("../models/Field"));
const FieldWater_1 = __importDefault(require("../models/FieldWater"));
const IrrigationAdvice_1 = __importDefault(require("../models/IrrigationAdvice"));
const genai_1 = require("@google/genai");
const createNotification_1 = __importDefault(require("../utils/createNotification"));
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const WEATHER_API_KEY = process.env.WEATHER_API;
const getIrrigationAdvice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fieldId } = req.params;
        const forceRefresh = req.query.refresh === "true";
        const user = req.user;
        // 1. Check Cache first (unless force refresh)
        if (!forceRefresh) {
            const cachedAdvice = yield IrrigationAdvice_1.default.findOne({
                field: fieldId,
                user: user._id,
                createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
            }).sort({ createdAt: -1 });
            if (cachedAdvice) {
                return res.status(200).json({ success: true, data: cachedAdvice });
            }
        }
        // 2. Fetch Field and Water Records
        const field = yield Field_1.default.findById(fieldId);
        if (!field) {
            return res.status(404).json({ success: false, message: "Field not found" });
        }
        // Get last irrigation
        const waterRecords = yield FieldWater_1.default.find({ field: fieldId }).sort({ date: -1 });
        const lastIrrigation = waterRecords.length > 0 ? waterRecords[0] : null;
        let daysSinceLastIrrigation = "Not available";
        if (lastIrrigation) {
            const diffTime = Math.abs(new Date().getTime() - new Date(lastIrrigation.date).getTime());
            daysSinceLastIrrigation = Math.ceil(diffTime / (1000 * 60 * 60 * 24)).toString();
        }
        const totalIrrigationCount = waterRecords.length;
        // 3. Fetch Weather Data
        let weatherData = {
            temp: 30, // fallback values
            humidity: 50,
            condition: "Clear",
            windSpeed: 5
        };
        try {
            const weatherRes = yield fetch(`https://api.openweathermap.org/data/2.5/weather?q=${user.city}&appid=${WEATHER_API_KEY}&units=metric`);
            if (weatherRes.ok) {
                const data = yield weatherRes.json();
                weatherData = {
                    temp: data.main.temp,
                    humidity: data.main.humidity,
                    condition: data.weather[0].main,
                    windSpeed: data.wind.speed,
                };
            }
        }
        catch (error) {
            console.log("Failed to fetch weather, using fallback", error);
        }
        // 4. Call Gemini AI
        const prompt = `
      You are an expert Indian agriculture advisor. Provide irrigation advice based on the following data:
      Crop: ${field.crop}
      Area: ${field.area}
      Last Irrigation: ${daysSinceLastIrrigation !== "Not available" ? daysSinceLastIrrigation + ' Days Ago' : 'No records'}
      Total Irrigations so far: ${totalIrrigationCount}
      
      Current Weather in ${user.city}:
      Temperature: ${weatherData.temp}°C
      Humidity: ${weatherData.humidity}%
      Weather Condition: ${weatherData.condition}
      Wind Speed: ${weatherData.windSpeed} km/h

      Analyze this and return ONLY a valid JSON object matching the following structure. Do NOT use markdown. Do NOT provide explanations outside JSON. The language for reason, recommendation and tips MUST be simple Hindi, understandable by farmers (avoid complicated scientific words).

      Structure:
      {
        "needsWater": boolean,
        "urgency": string ("Low", "Medium", "High", "Critical"),
        "recommendedWithinHours": number,
        "waterRequirement": string ("Low", "Medium", "High"),
        "reason": string (Explanation in Hindi),
        "recommendation": string (Clear recommendation in Hindi),
        "tips": string[] (Array of 3 practical irrigation tips in Hindi)
      }
    `;
        try {
            const response = yield ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            const textResult = response.text || "";
            // Strip markdown code blocks if any
            const jsonString = textResult.replace(/```json\n?|\n?```/g, "").trim();
            const aiResult = JSON.parse(jsonString);
            // 5. Save to DB
            const adviceRecord = yield IrrigationAdvice_1.default.create({
                user: user._id,
                field: field._id,
                crop: field.crop,
                weatherSnapshot: weatherData,
                aiResult
            });
            // 6. Create Notification if urgent
            if (aiResult.needsWater && (aiResult.urgency === "High" || aiResult.urgency === "Critical")) {
                // Prevent duplicate notification within 24 hours
                // Usually, the cache handles this, but since this is a new advice generation, we create it.
                yield (0, createNotification_1.default)({
                    user: user._id.toString(),
                    title: "सिंचाई की आवश्यकता",
                    message: `⚠ ${field.name} (${field.crop}) खेत में आज सिंचाई करने की सलाह दी जाती है।`,
                    type: "water"
                });
            }
            return res.status(200).json({ success: true, data: adviceRecord });
        }
        catch (aiError) {
            console.error("Gemini AI Error:", aiError);
            return res.status(500).json({ success: false, message: "इस समय AI सलाह उपलब्ध नहीं है। कृपया कुछ देर बाद पुनः प्रयास करें।" });
        }
    }
    catch (error) {
        console.error("Irrigation Advisor Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.getIrrigationAdvice = getIrrigationAdvice;
