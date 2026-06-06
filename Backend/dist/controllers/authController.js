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
exports.loginController = exports.registerController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
// REGISTER
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, pin, confirmPin, } = req.body;
        // CHECK PIN LENGTH
        if (pin.length < 6) {
            return res.status(400).json({
                success: false,
                message: "PIN must be at least 6 digits",
            });
        }
        // CHECK PIN MATCH
        if (pin !== confirmPin) {
            return res.status(400).json({
                success: false,
                message: "PIN and Confirm PIN do not match",
            });
        }
        // CHECK EXISTING USER
        const existingUser = yield User_1.default.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Phone number already exists",
            });
        }
        // HASH PIN
        const hashedPin = yield bcryptjs_1.default.hash(pin, 10);
        // CREATE USER
        const user = yield User_1.default.create({
            name,
            phone,
            pin: hashedPin,
        });
        // GENERATE TOKEN
        const token = (0, generateToken_1.default)(user._id.toString());
        res.status(201).json({
            success: true,
            token,
            user,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Registration Failed",
        });
    }
});
exports.registerController = registerController;
// LOGIN
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, pin } = req.body;
        // FIND USER
        const user = yield User_1.default.findOne({
            phone,
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials",
            });
        }
        // MATCH PIN
        const isMatch = yield bcryptjs_1.default.compare(pin, user.pin);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials",
            });
        }
        // TOKEN
        const token = (0, generateToken_1.default)(user._id.toString());
        res.status(200).json({
            success: true,
            token,
            user,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Login Failed",
        });
    }
});
exports.loginController = loginController;
