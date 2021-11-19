"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @since 0.6.0
 */
var Array_1 = require("fp-ts/lib/Array");
var Either_1 = require("fp-ts/lib/Either");
var Semigroup_1 = require("fp-ts/lib/Semigroup");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 0.6.0
 */
exports.success = function (value, next, start) {
    return Either_1.right({
        value: value,
        next: next,
        start: start
    });
};
/**
 * @category constructors
 * @since 0.6.0
 */
exports.error = function (input, expected, fatal) {
    if (expected === void 0) { expected = Array_1.empty; }
    if (fatal === void 0) { fatal = false; }
    return Either_1.left({
        input: input,
        expected: expected,
        fatal: fatal
    });
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 0.6.0
 */
exports.withExpected = function (err, expected) { return (__assign({}, err, { expected: expected })); };
/**
 * @category combinators
 * @since 0.6.0
 */
exports.escalate = function (err) { return (__assign({}, err, { fatal: true })); };
/**
 * @category combinators
 * @since 0.6.0
 */
exports.extend = function (err1, err2) {
    return getSemigroup().concat(err1, err2);
};
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
var getSemigroup = function () { return ({
    concat: function (x, y) {
        if (x.input.cursor < y.input.cursor)
            return Semigroup_1.getLastSemigroup().concat(x, y);
        if (x.input.cursor > y.input.cursor)
            return Semigroup_1.getFirstSemigroup().concat(x, y);
        return Semigroup_1.getStructSemigroup({
            input: Semigroup_1.getFirstSemigroup(),
            fatal: Semigroup_1.getFirstSemigroup(),
            expected: Array_1.getMonoid()
        }).concat(x, y);
    }
}); };
