"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sub = exports.pub = void 0;
const ioredis_1 = require("ioredis");
exports.pub = new ioredis_1.Redis();
exports.sub = new ioredis_1.Redis();
