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
exports.getCrops = exports.addCrop = void 0;
const Crop_1 = __importDefault(require("../models/Crop"));
// ADD CROP
const addCrop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, season, area, } = req.body;
        const crop = yield Crop_1.default.create({
            name,
            season,
            area,
            user: req.user._id,
        });
        res.status(201).json({
            success: true,
            data: crop,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to add crop",
        });
    }
});
exports.addCrop = addCrop;
// GET CROPS
const getCrops = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const crops = yield Crop_1.default.find({
            user: req.user._id,
        }).sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            data: crops,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch crops",
        });
    }
});
exports.getCrops = getCrops;
