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
exports.getDashboardStats = void 0;
const Farmer_1 = __importDefault(require("../models/Farmer"));
const Water_1 = __importDefault(require("../models/Water"));
// DASHBOARD STATS
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // TOTAL FARMERS
        const totalFarmers = yield Farmer_1.default.countDocuments({ user: req.user._id });
        // WATER ENTRIES
        const waterEntries = yield Water_1.default.find({ user: req.user._id });
        // TOTAL HOURS
        const totalHours = waterEntries.reduce((acc, item) => acc + item.hours, 0);
        // TOTAL EARNINGS
        const totalEarnings = waterEntries.reduce((acc, item) => acc + item.totalAmount, 0);
        // TOTAL ENTRIES
        const totalEntries = waterEntries.length;
        // WATER RATE
        const waterRate = req.user.waterRate;
        res.status(200).json({
            success: true,
            data: {
                totalFarmers,
                totalEntries,
                totalHours,
                totalEarnings,
                waterRate,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats",
        });
    }
});
exports.getDashboardStats = getDashboardStats;
