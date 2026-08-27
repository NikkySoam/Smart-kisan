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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
exports.redisClient = (0, redis_1.createClient)({
    url: redisUrl,
    pingInterval: 10000, // Keep-alive ping for cloud Redis (Upstash)
    socket: {
        reconnectStrategy: (retries) => {
            // Reconnect with backoff up to 3 seconds max interval
            return Math.min(retries * 500, 3000);
        },
    },
});
let hasLoggedError = false;
exports.redisClient.on("error", (err) => {
    if (!hasLoggedError) {
        console.log("Redis unavailable:", err.message || err);
        console.log("Application will continue running normally using MongoDB.");
        hasLoggedError = true;
    }
});
exports.redisClient.on("connect", () => {
    console.log("Redis connecting...");
});
exports.redisClient.on("ready", () => {
    console.log("Redis Connected & Ready!");
    hasLoggedError = false;
});
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!exports.redisClient.isOpen) {
            yield exports.redisClient.connect();
        }
    }
    catch (_a) {
        // Graceful catch when Redis server is offline
    }
});
exports.connectRedis = connectRedis;
