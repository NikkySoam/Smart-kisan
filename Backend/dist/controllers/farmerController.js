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
exports.deleteFarmer = exports.updateFarmer = exports.getFarmers = exports.addFarmer = void 0;
const Farmer_1 = __importDefault(require("../models/Farmer"));
const Water_1 = __importDefault(require("../models/Water"));
// ADD FARMER
const addFarmer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, village } = req.body;
        const farmer = yield Farmer_1.default.create({
            name,
            phone,
            village,
            user: req.user._id,
        });
        res.status(201).json({
            success: true,
            data: farmer,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to add farmer",
        });
    }
});
exports.addFarmer = addFarmer;
// GET FARMERS
const getFarmers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const farmers = yield Farmer_1.default.find({
            user: req.user._id,
        }).sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            data: farmers,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch farmers",
        });
    }
});
exports.getFarmers = getFarmers;
// UPDATE FARMER
const updateFarmer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, phone, village, } = req.body;
        const farmer = yield Farmer_1.default.findOne({
            _id: id,
            user: req.user._id,
        });
        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found",
            });
        }
        const updatedFarmer = yield Farmer_1.default.findByIdAndUpdate(id, {
            name,
            phone,
            village,
        }, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Farmer updated successfully",
            data: updatedFarmer,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update farmer",
        });
    }
});
exports.updateFarmer = updateFarmer;
// DELETE FARMER
const deleteFarmer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const farmer = yield Farmer_1.default.findOne({
            _id: id,
            user: req.user._id,
        });
        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found",
            });
        }
        // DELETE RELATED WATER ENTRIES
        yield Water_1.default.deleteMany({
            farmer: id,
        });
        // DELETE FARMER
        yield Farmer_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Farmer deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete farmer",
        });
    }
});
exports.deleteFarmer = deleteFarmer;
