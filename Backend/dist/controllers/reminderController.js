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
exports.checkReminders = void 0;
const Field_1 = __importDefault(require("../models/Field"));
const FieldWater_1 = __importDefault(require("../models/FieldWater"));
const Fertilizer_1 = __importDefault(require("../models/Fertilizer"));
const Notification_1 = __importDefault(require("../models/Notification"));
// CHECK REMINDERS
const checkReminders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // DELETE NOTIFICATIONS
        // OLDER THAN 7 DAYS
        const sevenDaysAgo = new Date(Date.now() -
            3 *
                24 *
                60 *
                60 *
                1000);
        yield Notification_1.default.deleteMany({
            createdAt: {
                $lt: sevenDaysAgo,
            },
        });
        const fields = yield Field_1.default.find({
            user: req.user._id,
        });
        for (const field of fields) {
            // WATER ENTRY
            const lastWater = yield FieldWater_1.default.findOne({
                field: field._id,
                user: req.user._id,
            }).sort({
                date: -1,
            });
            // FERTILIZER ENTRY
            const lastFertilizer = yield Fertilizer_1.default.findOne({
                field: field._id,
                user: req.user._id,
            }).sort({
                date: -1,
            });
            const today = new Date();
            // WATER REMINDER
            if (lastWater) {
                const waterDiff = Math.floor((today.getTime() -
                    new Date(lastWater.date).getTime()) /
                    (1000 *
                        60 *
                        60 *
                        24));
                if (waterDiff >= 7) {
                    // CHECK EXISTING
                    // CHECK LAST 24 HOURS
                    const yesterday = // 24 hrs before
                     new Date(Date.now() -
                        24 *
                            60 *
                            60 *
                            1000);
                    const existing = yield Notification_1.default.findOne({
                        user: req.user._id,
                        title: "Water Reminder",
                        type: "water",
                        message: {
                            $regex: field.name,
                            $options: "i",
                        },
                        createdAt: {
                            $gte: yesterday,
                        },
                    });
                    if (!existing) {
                        yield Notification_1.default.findOneAndUpdate({
                            user: req.user._id,
                            title: "Water Reminder",
                            type: "water",
                            message: {
                                $regex: field.name,
                                $options: "i",
                            },
                            createdAt: {
                                $gte: yesterday,
                            },
                        }, {
                            $setOnInsert: {
                                user: req.user._id,
                                title: "Water Reminder",
                                message: `Water reminder for ${field.name}. No water added since ${waterDiff} days.`,
                                type: "water",
                            },
                        }, {
                            upsert: true,
                            new: true,
                        });
                    }
                }
            }
            // FERTILIZER REMINDER
            if (lastFertilizer) {
                const fertilizerDiff = Math.floor((today.getTime() -
                    new Date(lastFertilizer.date).getTime()) /
                    (1000 *
                        60 *
                        60 *
                        24));
                if (fertilizerDiff >=
                    25) {
                    const yesterday = // 24hrs before
                     new Date(Date.now() -
                        24 *
                            60 *
                            60 *
                            1000);
                    const existing = yield Notification_1.default.findOne({
                        user: req.user._id,
                        title: "Fertilizer Reminder",
                        type: "fertilizer",
                        message: {
                            $regex: field.name,
                            $options: "i",
                        },
                        createdAt: {
                            $gte: yesterday,
                        },
                    });
                    if (!existing) {
                        yield Notification_1.default.findOneAndUpdate({
                            user: req.user._id,
                            title: "Fertilizer Reminder",
                            type: "fertilizer",
                            message: {
                                $regex: field.name,
                                $options: "i",
                            },
                            createdAt: {
                                $gte: yesterday,
                            },
                        }, {
                            $setOnInsert: {
                                user: req.user._id,
                                title: "Fertilizer Reminder",
                                message: `Fertilizer reminder for ${field.name}. No fertilizer added since ${fertilizerDiff} days.`,
                                type: "fertilizer",
                            },
                        }, {
                            upsert: true,
                            new: true,
                        });
                    }
                }
            }
        }
        res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Reminder check failed",
        });
    }
});
exports.checkReminders = checkReminders;
