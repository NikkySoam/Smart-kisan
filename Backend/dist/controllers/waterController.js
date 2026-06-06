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
exports.updateWaterEntry = exports.deleteWaterEntry = exports.getFarmerWaterHistory = exports.getWaterEntries = exports.addWaterEntry = void 0;
const Water_1 = __importDefault(require("../models/Water"));
const Farmer_1 = __importDefault(require("../models/Farmer"));
// ADD WATER ENTRY
const addWaterEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { farmer, hours, date, } = req.body;
        // CHECK FARMER EXISTS
        const farmerExists = yield Farmer_1.default.findOne({
            _id: farmer,
            user: req.user._id,
        });
        if (!farmerExists) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found",
            });
        }
        // USER WATER RATE
        const waterRate = req.user.waterRate;
        // TOTAL CALCULATION
        const totalAmount = Number(hours) *
            Number(waterRate);
        // CREATE WATER ENTRY
        const entry = yield Water_1.default.create({
            farmer,
            hours,
            date,
            totalAmount,
            user: req.user._id,
        });
        res.status(201).json({
            success: true,
            message: "Water entry added successfully",
            data: entry,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to add water entry",
        });
    }
});
exports.addWaterEntry = addWaterEntry;
// GET ALL WATER ENTRIES
const getWaterEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entries = yield Water_1.default.find({
            user: req.user._id,
        })
            .populate("farmer")
            .sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch water entries",
        });
    }
});
exports.getWaterEntries = getWaterEntries;
// GET SINGLE FARMER WATER HISTORY
const getFarmerWaterHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { farmerId } = req.params;
        // CHECK FARMER OWNERSHIP
        const farmerExists = yield Farmer_1.default.findOne({
            _id: farmerId,
            user: req.user._id,
        });
        if (!farmerExists) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found",
            });
        }
        const entries = yield Water_1.default.find({
            farmer: farmerId,
            user: req.user._id,
        })
            .populate("farmer")
            .sort({
            createdAt: -1,
        });
        // TOTAL HOURS
        const totalHours = entries.reduce((acc, item) => acc + item.hours, 0);
        // TOTAL AMOUNT
        const totalAmount = entries.reduce((acc, item) => acc + item.totalAmount, 0);
        res.status(200).json({
            success: true,
            totalHours,
            totalAmount,
            data: entries,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch farmer history",
        });
    }
});
exports.getFarmerWaterHistory = getFarmerWaterHistory;
// DELETE WATER ENTRY
const deleteWaterEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const entry = yield Water_1.default.findOne({
            _id: id,
            user: req.user._id,
        });
        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Water entry not found",
            });
        }
        yield Water_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Water entry deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete water entry",
        });
    }
});
exports.deleteWaterEntry = deleteWaterEntry;
// UPDATE WATER ENTRY
const updateWaterEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { farmer, hours, date, } = req.body;
        const entry = yield Water_1.default.findOne({
            _id: id,
            user: req.user._id,
        });
        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Water entry not found",
            });
        }
        // RECALCULATE TOTAL
        const totalAmount = Number(hours) *
            Number(req.user.waterRate);
        const updatedEntry = yield Water_1.default.findByIdAndUpdate(id, {
            farmer,
            hours,
            date,
            totalAmount,
        }, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Water entry updated successfully",
            data: updatedEntry,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update water entry",
        });
    }
});
exports.updateWaterEntry = updateWaterEntry;
