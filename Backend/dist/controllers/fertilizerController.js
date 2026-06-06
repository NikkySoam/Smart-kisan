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
exports.deleteFertilizer = exports.updateFertilizer = exports.getFertilizersByField = exports.getFertilizers = exports.addFertilizer = void 0;
const Fertilizer_1 = __importDefault(require("../models/Fertilizer"));
const Field_1 = __importDefault(require("../models/Field"));
// ADD FERTILIZER
const addFertilizer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { field, fertilizerName, quantity, cost, date, } = req.body;
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
        const fertilizer = yield Fertilizer_1.default.create({
            field,
            fertilizerName,
            quantity,
            cost,
            date,
            user: req.user._id,
        });
        res.status(201).json({
            success: true,
            data: fertilizer,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to add fertilizer",
        });
    }
});
exports.addFertilizer = addFertilizer;
// GET FERTILIZERS
const getFertilizers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fertilizers = yield Fertilizer_1.default.find({
            user: req.user._id,
        })
            .populate("field")
            .sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            data: fertilizers,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch fertilizers",
        });
    }
});
exports.getFertilizers = getFertilizers;
// GET FERTILIZER BY FIELD
const getFertilizersByField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fieldId } = req.params;
        const fertilizers = yield Fertilizer_1.default.find({
            field: fieldId,
            user: req.user._id,
        })
            .populate("field")
            .sort({
            date: -1,
        });
        const totalCost = fertilizers.reduce((acc, item) => acc + item.cost, 0);
        res.status(200).json({
            success: true,
            totalCost,
            data: fertilizers,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch fertilizers",
        });
    }
});
exports.getFertilizersByField = getFertilizersByField;
// UPDATE FERTILIZER
const updateFertilizer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { fertilizerName, quantity, cost, date, } = req.body;
        const fertilizer = yield Fertilizer_1.default.findOne({
            _id: id,
            user: req.user._id,
        });
        if (!fertilizer) {
            return res.status(404).json({
                success: false,
                message: "Fertilizer not found",
            });
        }
        fertilizer.fertilizerName =
            fertilizerName;
        fertilizer.quantity =
            quantity;
        fertilizer.cost =
            cost;
        fertilizer.date =
            date;
        yield fertilizer.save();
        res.status(200).json({
            success: true,
            data: fertilizer,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update fertilizer",
        });
    }
});
exports.updateFertilizer = updateFertilizer;
// DELETE FERTILIZER
const deleteFertilizer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const fertilizer = yield Fertilizer_1.default.findOne({
            _id: id,
            user: req.user._id,
        });
        if (!fertilizer) {
            return res.status(404).json({
                success: false,
                message: "Fertilizer not found",
            });
        }
        yield fertilizer.deleteOne();
        res.status(200).json({
            success: true,
            message: "Fertilizer deleted",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete fertilizer",
        });
    }
});
exports.deleteFertilizer = deleteFertilizer;
