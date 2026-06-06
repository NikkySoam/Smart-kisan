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
exports.deleteFieldWater = exports.updateFieldWater = exports.getFieldWaterByField = exports.getFieldWater = exports.addFieldWater = void 0;
const FieldWater_1 = __importDefault(require("../models/FieldWater"));
const Field_1 = __importDefault(require("../models/Field"));
// ADD WATER USAGE
const addFieldWater = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { field, hours, date, } = req.body;
        const fieldExists = yield Field_1.default.findOne({
            _id: field,
            user: req.user._id,
        });
        if (!fieldExists) {
            return res.status(404).json({
                success: false,
                message: "Field not found",
            });
        }
        const entry = yield FieldWater_1.default.create({
            field,
            hours,
            date,
            user: req.user._id,
        });
        res.status(201).json({
            success: true,
            data: entry,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to add field water entry",
        });
    }
});
exports.addFieldWater = addFieldWater;
// GET FIELD WATER
const getFieldWater = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entries = yield FieldWater_1.default.find({
            user: req.user._id,
        })
            .populate("field")
            .sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            data: entries,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch field water",
        });
    }
});
exports.getFieldWater = getFieldWater;
// GET WATER BY FIELD
const getFieldWaterByField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fieldId } = req.params;
        const entries = yield FieldWater_1.default.find({
            field: fieldId,
            user: req.user._id,
        })
            .populate("field")
            .sort({
            date: -1,
        });
        const totalHours = entries.reduce((acc, item) => acc + item.hours, 0);
        res.status(200).json({
            success: true,
            totalHours,
            data: entries,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch field water",
        });
    }
});
exports.getFieldWaterByField = getFieldWaterByField;
// UPDATE WATER ENTRY
const updateFieldWater = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { hours, date, } = req.body;
        const entry = yield FieldWater_1.default.findOne({
            _id: id,
            user: req.user._id,
        });
        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Entry not found",
            });
        }
        entry.hours = hours;
        entry.date = date;
        yield entry.save();
        res.status(200).json({
            success: true,
            data: entry,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update entry",
        });
    }
});
exports.updateFieldWater = updateFieldWater;
// DELETE WATER ENTRY
const deleteFieldWater = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const entry = yield FieldWater_1.default.findOne({
            _id: id,
            user: req.user._id,
        });
        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Entry not found",
            });
        }
        yield entry.deleteOne();
        res.status(200).json({
            success: true,
            message: "Entry deleted",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete entry",
        });
    }
});
exports.deleteFieldWater = deleteFieldWater;
