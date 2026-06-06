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
exports.getMonthlyReport = void 0;
const Water_1 = __importDefault(require("../models/Water"));
// MONTHLY REPORT
const getMonthlyReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { month, year, farmer, } = req.query;
        // FILTER OBJECT
        const filter = {
            user: req.user._id,
        };
        // MONTH FILTER
        if (month && year) {
            const startDate = new Date(Number(year), Number(month) - 1, 1);
            const endDate = new Date(Number(year), Number(month), 1);
            filter.date = {
                $gte: startDate,
                $lte: endDate,
            };
        }
        // FARMER FILTER
        if (farmer) {
            filter.farmer = farmer;
        }
        // GET ENTRIES
        const entries = yield Water_1.default.find(filter)
            .populate("farmer")
            .sort({
            date: -1,
        });
        // TOTAL HOURS
        const totalHours = entries.reduce((acc, item) => acc + item.hours, 0);
        // TOTAL EARNINGS
        const totalEarnings = entries.reduce((acc, item) => acc +
            item.totalAmount, 0);
        res.status(200).json({
            success: true,
            totalEntries: entries.length,
            totalHours,
            totalEarnings,
            data: entries,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch report",
        });
    }
});
exports.getMonthlyReport = getMonthlyReport;
