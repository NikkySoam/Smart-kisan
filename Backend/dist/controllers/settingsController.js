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
exports.updateCity = exports.updateProfile = exports.getSettings = exports.updateWaterRate = void 0;
const User_1 = __importDefault(require("../models/User"));
// UPDATE WATER RATE
const updateWaterRate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { waterRate } = req.body;
        // VALIDATION
        if (!waterRate) {
            return res.status(400).json({
                success: false,
                message: "Water rate is required",
            });
        }
        // UPDATE USER
        const user = yield User_1.default.findByIdAndUpdate(req.user._id, {
            waterRate,
        }, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Water rate updated successfully",
            data: user,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update water rate",
        });
    }
});
exports.updateWaterRate = updateWaterRate;
// GET CURRENT SETTINGS
const getSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id);
        res.status(200).json({
            success: true,
            data: {
                name: (user === null || user === void 0 ? void 0 : user.name) || "",
                phone: (user === null || user === void 0 ? void 0 : user.phone) || "",
                waterRate: (user === null || user === void 0 ? void 0 : user.waterRate) || 0,
                city: (user === null || user === void 0 ? void 0 : user.city) || "Meerut",
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch settings",
        });
    }
});
exports.getSettings = getSettings;
// UPDATE PROFILE
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, } = req.body;
        // UPDATE USER
        const updatedUser = yield User_1.default.findByIdAndUpdate(req.user._id, {
            name,
            phone,
        }, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
});
exports.updateProfile = updateProfile;
// UPDATE CITY
const updateCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { city } = req.body;
        if (!city) {
            return res.status(400).json({
                success: false,
                message: "City is required",
            });
        }
        const user = yield User_1.default.findByIdAndUpdate(req.user._id, {
            city,
        }, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "City updated successfully",
            data: user,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update city",
        });
    }
});
exports.updateCity = updateCity;
