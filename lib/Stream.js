"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @since 0.6.0
 */
var Array_1 = require("fp-ts/lib/Array");
var Eq_1 = require("fp-ts/lib/Eq");
var Option_1 = require("fp-ts/lib/Option");
var pipeable_1 = require("fp-ts/lib/pipeable");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 0.6.0
 */
exports.stream = function (buffer, cursor) {
    if (cursor === void 0) { cursor = 0; }
    return ({
        buffer: buffer,
        cursor: cursor
    });
};
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * @category destructors
 * @since 0.6.0
 */
exports.get = function (s) { return Array_1.lookup(s.cursor, s.buffer); };
/**
 * @category destructors
 * @since 0.6.0
 */
exports.atEnd = function (s) { return s.cursor >= s.buffer.length; };
/**
 * @category destructors
 * @since 0.6.0
 */
exports.getAndNext = function (s) {
    return pipeable_1.pipe(exports.get(s), Option_1.map(function (a) { return ({ value: a, next: { buffer: s.buffer, cursor: s.cursor + 1 } }); }));
};
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 0.6.0
 */
exports.getEq = function (E) {
    var EA = Array_1.getEq(E);
    return Eq_1.fromEquals(function (x, y) { return x.cursor === y.cursor && EA.equals(x.buffer, y.buffer); });
};
