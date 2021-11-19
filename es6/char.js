/**
 * @since 0.6.0
 */
import { not } from 'fp-ts/es6/function';
import { monoidString } from 'fp-ts/es6/Monoid';
import { pipe } from 'fp-ts/es6/pipeable';
import * as P from './Parser';
var maybe = P.maybe(monoidString);
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
export var char = function (c) {
    return P.expected(P.sat(function (s) { return s === c; }), "\"" + c + "\"");
};
/**
 * The `notChar` parser constructor makes a parser which will match any
 * single character other than the one provided.
 *
 * @category constructors
 * @since 0.6.0
 */
export var notChar = function (c) {
    return P.expected(P.sat(function (c1) { return c1 !== c; }), "anything but \"" + c + "\"");
};
var isOneOf = function (s, c) { return s.indexOf(c) !== -1; };
/**
 * Matches any one character from the provided string.
 *
 * @category constructors
 * @since 0.6.0
 */
export var oneOf = function (s) {
    return P.expected(P.sat(function (c) { return isOneOf(s, c); }), "One of \"" + s + "\"");
};
/**
 * Matches a single character which isn't a character from the provided string.
 *
 * @category constructors
 * @since 0.6.0
 */
export var notOneOf = function (s) {
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
export var many = function (parser) { return maybe(many1(parser)); };
/**
 * Takes a `Parser<Char, string>` and matches it one or more times, returning
 * a `string` of what was matched.
 *
 * @category combinators
 * @since 0.6.0
 */
export var many1 = function (parser) {
    return pipe(P.many1(parser), P.map(function (nea) { return nea.join(''); }));
};
var isDigit = function (c) { return '0123456789'.indexOf(c) !== -1; };
/**
 * Matches a single digit.
 *
 * @category combinators
 * @since 0.6.0
 */
export var digit = P.expected(P.sat(isDigit), 'a digit');
var spaceRe = /^\s$/;
var isSpace = function (c) { return spaceRe.test(c); };
/**
 * Matches a single whitespace character.
 *
 * @category combinators
 * @since 0.6.0
 */
export var space = P.expected(P.sat(isSpace), 'a whitespace');
var isUnderscore = function (c) { return c === '_'; };
var isLetter = function (c) { return /[a-z]/.test(c.toLowerCase()); };
var isAlphanum = function (c) { return isLetter(c) || isDigit(c) || isUnderscore(c); };
/**
 * Matches a single letter, digit or underscore character.
 *
 * @category combinators
 * @since 0.6.0
 */
export var alphanum = P.expected(P.sat(isAlphanum), 'a word character');
/**
 * Matches a single ASCII letter.
 *
 * @since 0.6.0
 */
export var letter = P.expected(P.sat(isLetter), 'a letter');
var isUnicodeLetter = function (c) { return c.toLowerCase() !== c.toUpperCase(); };
/**
 * Matches a single Unicode letter.
 * Works for scripts which have a notion of an upper case and lower case letters
 * (Latin-based scripts, Greek, Russian etc).
 *
 * @category combinators
 * @since 0.6.16
 */
export var unicodeLetter = P.expected(P.sat(isUnicodeLetter), 'an unicode letter');
var isUpper = function (c) { return isLetter(c) && c === c.toUpperCase(); };
/**
 * Matches a single upper case ASCII letter.
 *
 * @category combinators
 * @since 0.6.0
 */
export var upper = P.expected(P.sat(isUpper), 'an upper case letter');
var isLower = function (c) { return isLetter(c) && c === c.toLowerCase(); };
/**
 * Matches a single lower case ASCII letter.
 *
 * @category combinators
 * @since 0.6.0
 */
export var lower = P.expected(P.sat(isLower), 'a lower case letter');
/**
 * Matches a single character which isn't a digit.
 *
 * @category combinators
 * @since 0.6.0
 */
export var notDigit = P.expected(P.sat(not(isDigit)), 'a non-digit');
/**
 * Matches a single character which isn't whitespace.
 *
 * @category combinators
 * @since 0.6.0
 */
export var notSpace = P.expected(P.sat(not(isSpace)), 'a non-whitespace character');
/**
 * Matches a single character which isn't a letter, digit or underscore.
 *
 * @category combinators
 * @since 0.6.0
 */
export var notAlphanum = P.expected(P.sat(not(isAlphanum)), 'a non-word character');
/**
 * Matches a single character which isn't an ASCII letter.
 *
 * @category combinators
 * @since 0.6.0
 */
export var notLetter = P.expected(P.sat(not(isLetter)), 'a non-letter character');
/**
 * Matches a single character which isn't an upper case ASCII letter.
 *
 * @category combinators
 * @since 0.6.0
 */
export var notUpper = P.expected(P.sat(not(isUpper)), 'anything but an upper case letter');
/**
 * Matches a single character which isn't a lower case ASCII letter.
 *
 * @category combinators
 * @since 0.6.0
 */
export var notLower = P.expected(P.sat(not(isLower)), 'anything but a lower case letter');
