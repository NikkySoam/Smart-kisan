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
exports.deleteCropScan = exports.getCropHistory = exports.detectCropIssue = void 0;
const genai_1 = require("@google/genai");
const cropScanModel_1 = __importDefault(require("../models/cropScanModel"));
const uploadToCloudinary_1 = require("../utils/uploadToCloudinary");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const ai = new genai_1.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
const detectCropIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image required",
            });
        }
        const imageBase64 = req.file.buffer.toString("base64");
        const response = yield ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    inlineData: {
                        mimeType: req.file.mimetype,
                        data: imageBase64,
                    },
                },
                {
                    text: `
              You are an expert agricultural assistant for Indian farmers.
              
            Your task is to analyze the uploaded crop image and identify the most likely pest, disease, nutrient deficiency, or crop health issue.

            Priority:

            * Support all crops (wheat, rice, sugarcane, maize, potato, tomato, mustard, vegetables, fruits, etc.).
            * Give special attention to sugarcane diseases and pests because they are commonly encountered by users.
            * For sugarcane, carefully check for Top Borer, Pyrilla (Phoka), Thrips, Ant Attack, Red Rot, Smut, Wilt, and other common issues.

            Instructions:

            1. Identify the crop if possible.
            2. Identify the most likely problem visible in the image.
            3. Respond in simple Hindi that a farmer can easily understand.
            4. Avoid scientific names and complex agricultural terms.
            5. Keep explanations short and practical.
            6. Focus on symptoms, treatment, and prevention.
            7. Do not provide unnecessary technical analysis.
            8. Mention only commonly available pesticides, fungicides, or remedies.
            9. Keep the response concise and farmer-friendly.
            10. Unable to Identify:
            If the image is blurry, dark, or unclear, return:
            {
              "crop": "तस्वीर स्पष्ट नहीं है",
              "problem": "Unable to Identify",
              "symptoms": ["तस्वीर स्पष्ट नहीं है"],
              "medicine": [],
              "advice": ["कृपया साफ और नजदीक से फोटो अपलोड करें"]
            }

            Return JSON only:

            {
            "crop": "",
            "problem": "",
            "symptoms": [
            "",
            "",
            ""
            ],
            "medicine": [
            "",
            ""
            ],
            "advice": [
            "",
            ""
            ]
            }
            
            Example response:

            {
            "crop": "Sugarcane",
            "problem": "Top Borer",
            "symptoms": [
            "ऊपरी पत्तियां सूख रही हैं",
            "पौधे की बढ़वार रुक रही है",
            "तने में छेद दिखाई दे रहे हैं"
            ],
            "medicine": [
            "Chlorantraniliprole 18.5% SC",
            "Fipronil 0.3% GR"
            ],
            "advice": [
            "प्रभावित पौधों को हटाएं",
            "समय पर दवा का छिड़काव करें"
            ]
            }

            `,
                }
            ],
            config: {
                responseMimeType: "application/json",
            }
        });
        const responseText = (_a = response.text) !== null && _a !== void 0 ? _a : "";
        let analysisResult = null;
        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysisResult = JSON.parse(jsonMatch[0]);
            }
            else if (responseText.trim().length > 0) {
                analysisResult = JSON.parse(responseText);
            }
            // SAVE IN CLOUD
            const uploadResult = yield (0, uploadToCloudinary_1.uploadToCloudinary)(req.file.buffer, "crop-doctor");
            const imageUrl = uploadResult.secure_url;
            const cloudinaryPublicId = uploadResult.public_id;
            // STORE IN DATABASE
            const userId = req.user._id;
            if (analysisResult) {
                yield cropScanModel_1.default.create({
                    user: userId,
                    imageUrl,
                    cloudinaryPublicId,
                    crop: analysisResult.crop,
                    problem: analysisResult.problem,
                    symptoms: analysisResult.symptoms || [],
                    medicine: analysisResult.medicine || [],
                    advice: analysisResult.advice || [],
                });
            }
        }
        catch (parseError) {
            analysisResult = null;
        }
        res.status(200).json({
            success: true,
            data: analysisResult,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "AI analysis failed",
        });
    }
});
exports.detectCropIssue = detectCropIssue;
// GET CROP ANALYSIS HISTORY
const getCropHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const scans = yield cropScanModel_1.default.find({
            user: userId,
        })
            .sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            data: scans,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to fetch crop history",
        });
    }
});
exports.getCropHistory = getCropHistory;
// DELETE HISTORY CARD
const deleteCropScan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const scan = yield cropScanModel_1.default.findOne({
            _id: req.params.id,
            user: userId,
        });
        if (!scan) {
            return res.status(404).json({
                success: false,
                message: "Scan not found",
            });
        }
        yield cloudinary_1.default.uploader.destroy(scan.cloudinaryPublicId);
        yield cropScanModel_1.default.findByIdAndDelete(scan._id);
        res.status(200).json({
            success: true,
            message: "Scan deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Delete failed",
        });
    }
});
exports.deleteCropScan = deleteCropScan;
