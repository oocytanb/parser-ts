"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @since 0.6.0
 */
var char = __importStar(require("./char"));
exports.char = char;
var parser = __importStar(require("./Parser"));
exports.parser = parser;
var parseResult = __importStar(require("./ParseResult"));
exports.parseResult = parseResult;
var stream = __importStar(require("./Stream"));
exports.stream = stream;
var string = __importStar(require("./string"));
exports.string = string;
