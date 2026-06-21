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
exports.deleteEquipment = exports.updateEquipment = exports.getEquipmentByField = exports.addEquipment = void 0;
const Equipment_1 = __importDefault(require("../models/Equipment"));
const Field_1 = __importDefault(require("../models/Field"));
// ADD EQUIPMENT
const addEquipment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { field, equipmentName, amount, date } = req.body;
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
        const equipment = yield Equipment_1.default.create({
            field,
            equipmentName,
            amount,
            date,
            user: req.user._id,
        });
        res.status(201).json({
            success: true,
            data: equipment,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to add equipment",
        });
    }
});
exports.addEquipment = addEquipment;
// GET EQUIPMENT BY FIELD
const getEquipmentByField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fieldId } = req.params;
        const equipment = yield Equipment_1.default.find({
            field: fieldId,
            user: req.user._id,
        })
            .populate("field")
            .sort({
            date: -1,
        });
        const totalAmount = equipment.reduce((acc, item) => acc + item.amount, 0);
        res.status(200).json({
            success: true,
            totalAmount,
            data: equipment,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch equipment",
        });
    }
});
exports.getEquipmentByField = getEquipmentByField;
// UPDATE EQUIPMENT
const updateEquipment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { equipmentName, amount, date } = req.body;
        const equipment = yield Equipment_1.default.findOne({
            _id: id,
            user: req.user._id,
        });
        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found",
            });
        }
        equipment.equipmentName = equipmentName;
        equipment.amount = amount;
        equipment.date = date;
        yield equipment.save();
        res.status(200).json({
            success: true,
            data: equipment,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update equipment",
        });
    }
});
exports.updateEquipment = updateEquipment;
// DELETE EQUIPMENT
const deleteEquipment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const equipment = yield Equipment_1.default.findOne({
            _id: id,
            user: req.user._id,
        });
        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found",
            });
        }
        yield equipment.deleteOne();
        res.status(200).json({
            success: true,
            message: "Equipment deleted",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete equipment",
        });
    }
});
exports.deleteEquipment = deleteEquipment;
