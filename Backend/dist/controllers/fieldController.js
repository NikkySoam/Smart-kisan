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
exports.deleteField = exports.updateField = exports.getFieldDetails = exports.getFields = exports.addField = void 0;
const Field_1 = __importDefault(require("../models/Field"));
const FieldWater_1 = __importDefault(require("../models/FieldWater"));
const Fertilizer_1 = __importDefault(require("../models/Fertilizer"));
const Labour_1 = __importDefault(require("../models/Labour"));
const Equipment_1 = __importDefault(require("../models/Equipment"));
const User_1 = __importDefault(require("../models/User"));
// ADD FIELD
const addField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, area, location, crop, } = req.body;
        const field = yield Field_1.default.create({
            name,
            area,
            location,
            crop,
            user: req.user._id,
        });
        res.status(201).json({
            success: true,
            data: field,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to add field",
        });
    }
});
exports.addField = addField;
// GET FIELDS
const getFields = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fields = yield Field_1.default.find({
            user: req.user._id,
        }).sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            data: fields,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch fields",
        });
    }
});
exports.getFields = getFields;
// FIELD DETAILS
const getFieldDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // CHECK FIELD
        const field = yield Field_1.default.findOne({
            _id: id,
            user: req.user._id,
        });
        if (!field) {
            return res.status(404).json({
                success: false,
                message: "Field not found",
            });
        }
        // FETCH DATA
        const water = yield FieldWater_1.default.find({
            field: id,
            user: req.user._id,
        });
        const fertilizers = yield Fertilizer_1.default.find({
            field: id,
            user: req.user._id,
        });
        const labour = yield Labour_1.default.find({
            field: id,
            user: req.user._id,
        });
        const equipment = yield Equipment_1.default.find({
            field: id,
            user: req.user._id,
        });
        // TOTALS
        // USER WATER RATE
        const user = yield User_1.default.findById(req.user._id);
        const waterHours = water.reduce((acc, item) => acc + item.hours, 0);
        const waterTotal = waterHours *
            ((user === null || user === void 0 ? void 0 : user.waterRate) || 0);
        // FERTILIZER TOTAL
        const fertilizerTotal = fertilizers.reduce((acc, item) => acc + item.cost, 0);
        // LABOUR TOTAL
        const labourTotal = labour.reduce((acc, item) => acc + item.amount, 0);
        // EQUIPMENT TOTAL
        const equipmentTotal = equipment.reduce((acc, item) => acc + item.amount, 0);
        const totalExpense = waterTotal +
            fertilizerTotal +
            labourTotal +
            equipmentTotal;
        res.status(200).json({
            success: true,
            field,
            totals: {
                water: waterTotal,
                fertilizer: fertilizerTotal,
                labour: labourTotal,
                equipment: equipmentTotal,
                totalExpense,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch field details",
        });
    }
});
exports.getFieldDetails = getFieldDetails;
// UPDATE FIELD
const updateField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, area, location, crop, } = req.body;
        const field = yield Field_1.default.findOne({
            _id: id,
            user: req.user._id,
        });
        if (!field) {
            return res.status(404).json({
                success: false,
                message: "Field not found",
            });
        }
        field.name = name;
        field.area = area;
        field.location =
            location;
        field.crop = crop;
        yield field.save();
        res.status(200).json({
            success: true,
            data: field,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update field",
        });
    }
});
exports.updateField = updateField;
// DELETE FIELD
const deleteField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const field = yield Field_1.default.findOne({
            _id: id,
            user: req.user._id,
        });
        if (!field) {
            return res.status(404).json({
                success: false,
                message: "Field not found",
            });
        }
        yield field.deleteOne();
        res.status(200).json({
            success: true,
            message: "Field deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete field",
        });
    }
});
exports.deleteField = deleteField;
