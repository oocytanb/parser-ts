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
var function_1 = require("fp-ts/lib/function");
var Monoid_1 = require("fp-ts/lib/Monoid");
var pipeable_1 = require("fp-ts/lib/pipeable");
var P = __importStar(require("./Parser"));
var maybe = P.maybe(Monoid_1.monoidString);
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * The `char` parser constructor returns a parser which matches only the
 * specified single character
 *
 * @category constructors
 * @since 0.6.0
 */
exports.char = function (c) {
    return P.expected(P.sat(function (s) { return s === c; }), "\"" + c + "\"");
};
/**
 * The `notChar` parser constructor makes a parser which will match any
 * single character other than the one provided.
 *
 * @category constructors
 * @since 0.6.0
 */
exports.notChar = function (c) {
    return P.expected(P.sat(function (c1) { return c1 !== c; }), "anything but \"" + c + "\"");
};
var isOneOf = function (s, c) { return s.indexOf(c) !== -1; };
/**
 * Matches any one character from the provided string.
 *
 * @category constructors
 * @since 0.6.0
 */
exports.oneOf = function (s) {
    return P.expected(P.sat(function (c) { return isOneOf(s, c); }), "One of \"" + s + "\"");
};
/**
 * Matches a single character which isn't a character from the provided string.
 *
 * @category constructors
 * @since 0.6.0
 */
exports.notOneOf = function (s) {
    return P.expected(P.sat(function (c) { return !isOneOf(s, c); }), "Not one of " + JSON.stringify(s));
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Takes a `Parser<Char, string>` and matches it zero or more times, returning
 * a `string` of what was matched.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.many = function (parser) { return maybe(exports.many1(parser)); };
/**
 * Takes a `Parser<Char, string>` and matches it one or more times, returning
 * a `string` of what was matched.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.many1 = function (parser) {
    return pipeable_1.pipe(P.many1(parser), P.map(function (nea) { return nea.join(''); }));
};
var isDigit = function (c) { return '0123456789'.indexOf(c) !== -1; };
/**
 * Matches a single digit.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.digit = P.expected(P.sat(isDigit), 'a digit');
var spaceRe = /^\s$/;
var isSpace = function (c) { return spaceRe.test(c); };
/**
 * Matches a single whitespace character.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.space = P.expected(P.sat(isSpace), 'a whitespace');
var isUnderscore = function (c) { return c === '_'; };
var isLetter = function (c) { return /[a-z]/.test(c.toLowerCase()); };
var isAlphanum = function (c) { return isLetter(c) || isDigit(c) || isUnderscore(c); };
/**
 * Matches a single letter, digit or underscore character.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.alphanum = P.expected(P.sat(isAlphanum), 'a word character');
/**
 * Matches a single ASCII letter.
 *
 * @since 0.6.0
 */
exports.letter = P.expected(P.sat(isLetter), 'a letter');
var isUnicodeLetter = function (c) { return c.toLowerCase() !== c.toUpperCase(); };
/**
 * Matches a single Unicode letter.
 * Works for scripts which have a notion of an upper case and lower case letters
 * (Latin-based scripts, Greek, Russian etc).
 *
 * @category combinators
 * @since 0.6.16
 */
exports.unicodeLetter = P.expected(P.sat(isUnicodeLetter), 'an unicode letter');
var isUpper = function (c) { return isLetter(c) && c === c.toUpperCase(); };
/**
 * Matches a single upper case ASCII letter.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.upper = P.expected(P.sat(isUpper), 'an upper case letter');
var isLower = function (c) { return isLetter(c) && c === c.toLowerCase(); };
/**
 * Matches a single lower case ASCII letter.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.lower = P.expected(P.sat(isLower), 'a lower case letter');
/**
 * Matches a single character which isn't a digit.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.notDigit = P.expected(P.sat(function_1.not(isDigit)), 'a non-digit');
/**
 * Matches a single character which isn't whitespace.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.notSpace = P.expected(P.sat(function_1.not(isSpace)), 'a non-whitespace character');
/**
 * Matches a single character which isn't a letter, digit or underscore.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.notAlphanum = P.expected(P.sat(function_1.not(isAlphanum)), 'a non-word character');
/**
 * Matches a single character which isn't an ASCII letter.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.notLetter = P.expected(P.sat(function_1.not(isLetter)), 'a non-letter character');
/**
 * Matches a single character which isn't an upper case ASCII letter.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.notUpper = P.expected(P.sat(function_1.not(isUpper)), 'anything but an upper case letter');
/**
 * Matches a single character which isn't a lower case ASCII letter.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.notLower = P.expected(P.sat(function_1.not(isLower)), 'anything but a lower case letter');
