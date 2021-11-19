import * as P from './Parser'
/**
 * @category model
 * @since 0.6.0
 */
export declare type Char = string
/**
 * The `char` parser constructor returns a parser which matches only the
 * specified single character
 *
 * @category constructors
 * @since 0.6.0
 */
export declare const char: (c: Char) => P.Parser<Char, Char>
/**
 * The `notChar` parser constructor makes a parser which will match any
 * single character other than the one provided.
 *
 * @category constructors
 * @since 0.6.0
 */
export declare const notChar: (c: Char) => P.Parser<Char, Char>
/**
 * Matches any one character from the provided string.
 *
 * @category constructors
 * @since 0.6.0
 */
export declare const oneOf: (s: string) => P.Parser<Char, Char>
/**
 * Matches a single character which isn't a character from the provided string.
 *
 * @category constructors
 * @since 0.6.0
 */
export declare const notOneOf: (s: string) => P.Parser<Char, Char>
/**
 * Takes a `Parser<Char, string>` and matches it zero or more times, returning
 * a `string` of what was matched.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const many: (parser: P.Parser<Char, Char>) => P.Parser<Char, string>
/**
 * Takes a `Parser<Char, string>` and matches it one or more times, returning
 * a `string` of what was matched.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const many1: (parser: P.Parser<Char, Char>) => P.Parser<Char, string>
/**
 * Matches a single digit.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const digit: P.Parser<Char, Char>
/**
 * Matches a single whitespace character.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const space: P.Parser<Char, Char>
/**
 * Matches a single letter, digit or underscore character.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const alphanum: P.Parser<Char, Char>
/**
 * Matches a single ASCII letter.
 *
 * @since 0.6.0
 */
export declare const letter: P.Parser<string, string>
/**
 * Matches a single Unicode letter.
 * Works for scripts which have a notion of an upper case and lower case letters
 * (Latin-based scripts, Greek, Russian etc).
 *
 * @category combinators
 * @since 0.6.16
 */
export declare const unicodeLetter: P.Parser<string, string>
/**
 * Matches a single upper case ASCII letter.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const upper: P.Parser<Char, Char>
/**
 * Matches a single lower case ASCII letter.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const lower: P.Parser<Char, Char>
/**
 * Matches a single character which isn't a digit.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const notDigit: P.Parser<Char, Char>
/**
 * Matches a single character which isn't whitespace.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const notSpace: P.Parser<Char, Char>
/**
 * Matches a single character which isn't a letter, digit or underscore.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const notAlphanum: P.Parser<Char, Char>
/**
 * Matches a single character which isn't an ASCII letter.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const notLetter: P.Parser<Char, Char>
/**
 * Matches a single character which isn't an upper case ASCII letter.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const notUpper: P.Parser<Char, Char>
/**
 * Matches a single character which isn't a lower case ASCII letter.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const notLower: P.Parser<Char, Char>
