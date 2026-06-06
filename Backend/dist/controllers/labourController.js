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
exports.deleteLabour = exports.updateLabour = exports.getLabourByField = exports.addLabour = void 0;
const Labour_1 = __importDefault(require("../models/Labour"));
const Field_1 = __importDefault(require("../models/Field"));
// ADD LABOUR
const addLabour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { field, amount, workType, date, } = req.body;
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
        const labour = yield Labour_1.default.create({
            field,
            amount,
            workType,
            date,
            user: req.user._id,
        });
        res.status(201).json({
            success: true,
            data: labour,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to add labour",
        });
    }
});
exports.addLabour = addLabour;
// GET LABOUR BY FIELD
const getLabourByField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fieldId } = req.params;
        const labour = yield Labour_1.default.find({
            field: fieldId,
            user: req.user._id,
        })
            .populate("field")
            .sort({
            date: -1,
        });
        const totalAmount = labour.reduce((acc, item) => acc + item.amount, 0);
        res.status(200).json({
            success: true,
            totalAmount,
            data: labour,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch labour",
        });
    }
});
exports.getLabourByField = getLabourByField;
// UPDATE LABOUR
const updateLabour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { amount, workType, date, } = req.body;
        const labour = yield Labour_1.default.findOne({
            _id: id,
            user: req.user._id,
        });
        if (!labour) {
            return res.status(404).json({
                success: false,
                message: "Labour entry not found",
            });
        }
        labour.amount = amount;
        labour.workType = workType;
        labour.date = date;
        yield labour.save();
        res.status(200).json({
            success: true,
            data: labour,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update labour",
        });
    }
});
exports.updateLabour = updateLabour;
// DELETE LABOUR
const deleteLabour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const labour = yield Labour_1.default.findOne({
            _id: id,
            user: req.user._id,
        });
        if (!labour) {
            return res.status(404).json({
                success: false,
                message: "Labour entry not found",
            });
        }
        yield labour.deleteOne();
        res.status(200).json({
            success: true,
            message: "Labour entry deleted",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete labour",
        });
    }
});
exports.deleteLabour = deleteLabour;
