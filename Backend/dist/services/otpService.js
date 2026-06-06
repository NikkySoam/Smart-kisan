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
exports.verifyOTP = exports.sendOTP = void 0;
const axios_1 = __importDefault(require("axios"));
// SEND OTP
const sendOTP = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post("https://control.msg91.com/api/v5/otp", {
            mobile: `91${phone}`,
            template_id: process.env.MSG91_TEMPLATE_ID,
        }, {
            headers: {
                authkey: process.env.MSG91_AUTH_KEY,
            },
        });
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to send OTP");
    }
});
exports.sendOTP = sendOTP;
// VERIFY OTP
const verifyOTP = (phone, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://control.msg91.com/api/v5/otp/verify?mobile=91${phone}&otp=${otp}`, {
            headers: {
                authkey: process.env.MSG91_AUTH_KEY,
            },
        });
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw new Error("OTP Verification Failed");
    }
});
exports.verifyOTP = verifyOTP;
