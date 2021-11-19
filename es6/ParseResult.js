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
/**
 * @since 0.6.0
 */
import { empty, getMonoid } from 'fp-ts/es6/Array';
import { left, right } from 'fp-ts/es6/Either';
import { getFirstSemigroup, getLastSemigroup, getStructSemigroup } from 'fp-ts/es6/Semigroup';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 0.6.0
 */
export var success = function (value, next, start) {
    return right({
        value: value,
        next: next,
        start: start
    });
};
/**
 * @category constructors
 * @since 0.6.0
 */
export var error = function (input, expected, fatal) {
    if (expected === void 0) { expected = empty; }
    if (fatal === void 0) { fatal = false; }
    return left({
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
export var withExpected = function (err, expected) { return (__assign({}, err, { expected: expected })); };
/**
 * @category combinators
 * @since 0.6.0
 */
export var escalate = function (err) { return (__assign({}, err, { fatal: true })); };
/**
 * @category combinators
 * @since 0.6.0
 */
export var extend = function (err1, err2) {
    return getSemigroup().concat(err1, err2);
};
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
var getSemigroup = function () { return ({
    concat: function (x, y) {
        if (x.input.cursor < y.input.cursor)
            return getLastSemigroup().concat(x, y);
        if (x.input.cursor > y.input.cursor)
            return getFirstSemigroup().concat(x, y);
        return getStructSemigroup({
            input: getFirstSemigroup(),
            fatal: getFirstSemigroup(),
            expected: getMonoid()
        }).concat(x, y);
    }
}); };
