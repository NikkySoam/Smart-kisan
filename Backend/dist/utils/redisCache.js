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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCachePattern = exports.deleteCache = exports.setCache = exports.getCache = void 0;
const redis_1 = require("../config/redis");
const getCache = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!redis_1.redisClient.isOpen)
            return null;
        const data = yield redis_1.redisClient.get(key);
        if (data) {
            console.log(`Redis cache HIT: ${key}`);
            return JSON.parse(data);
        }
        console.log(`Redis cache MISS: ${key}`);
        return null;
    }
    catch (error) {
        console.log(`Redis getCache error for key ${key}:`, error);
        return null;
    }
});
exports.getCache = getCache;
const setCache = (key, value, ttlSeconds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!redis_1.redisClient.isOpen)
            return false;
        const serialized = JSON.stringify(value);
        yield redis_1.redisClient.setEx(key, ttlSeconds, serialized);
        console.log(`Redis cache SET: ${key} (TTL: ${ttlSeconds}s)`);
        return true;
    }
    catch (error) {
        console.log(`Redis setCache error for key ${key}:`, error);
        return false;
    }
});
exports.setCache = setCache;
const deleteCache = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!redis_1.redisClient.isOpen)
            return false;
        yield redis_1.redisClient.del(key);
        console.log(`Redis cache INVALIDATED: ${key}`);
        return true;
    }
    catch (error) {
        console.log(`Redis deleteCache error for key ${key}:`, error);
        return false;
    }
});
exports.deleteCache = deleteCache;
const deleteCachePattern = (pattern) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        if (!redis_1.redisClient.isOpen)
            return false;
        const keys = [];
        try {
            for (var _d = true, _e = __asyncValues(redis_1.redisClient.scanIterator({ MATCH: pattern })), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const key = _c;
                keys.push(String(key));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (keys.length > 0) {
            yield redis_1.redisClient.del(keys);
            console.log(`Redis cache INVALIDATED PATTERN: ${pattern} (${keys.length} keys deleted)`);
        }
        return true;
    }
    catch (error) {
        console.log(`Redis deleteCachePattern error for pattern ${pattern}:`, error);
        return false;
    }
});
exports.deleteCachePattern = deleteCachePattern;
