/**
 * @since 0.6.0
 */
import { Foldable, Foldable1 } from 'fp-ts/es6/Foldable'
import { Functor, Functor1 } from 'fp-ts/es6/Functor'
import { HKT, Kind, URIS } from 'fp-ts/HKT'
import * as C from './char'
import * as P from './Parser'
import * as PR from './ParseResult'
/**
 * Matches the exact string provided.
 *
 * @category constructors
 * @since 0.6.0
 */
export declare const string: (s: string) => P.Parser<C.Char, string>
/**
 * Matches one of a list of strings.
 *
 * @category constructors
 * @since 0.6.0
 */
export declare function oneOf<F extends URIS>(
  F: Functor1<F> & Foldable1<F>
): (ss: Kind<F, string>) => P.Parser<C.Char, string>
export declare function oneOf<F>(F: Functor<F> & Foldable<F>): (ss: HKT<F, string>) => P.Parser<C.Char, string>
/**
 * @category destructors
 * @since 0.6.0
 */
export declare const fold: <I>(as: Array<P.Parser<I, string>>) => P.Parser<I, string>
/**
 * @category combinators
 * @since 0.6.0
 */
export declare const maybe: <I>(p: P.Parser<I, string>) => P.Parser<I, string>
/**
 * Matches the given parser zero or more times, returning a string of the
 * entire match
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const many: (parser: P.Parser<C.Char, string>) => P.Parser<C.Char, string>
/**
 * Matches the given parser one or more times, returning a string of the
 * entire match
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const many1: (parser: P.Parser<C.Char, string>) => P.Parser<C.Char, string>
/**
 * Matches zero or more whitespace characters.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const spaces: P.Parser<C.Char, string>
/**
 * Matches one or more whitespace characters.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const spaces1: P.Parser<C.Char, string>
/**
 * Matches zero or more non-whitespace characters.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const notSpaces: P.Parser<C.Char, string>
/**
 * Matches one or more non-whitespace characters.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const notSpaces1: P.Parser<C.Char, string>
/**
 * @category combinators
 * @since 0.6.0
 */
export declare const int: P.Parser<C.Char, number>
/**
 * @category combinators
 * @since 0.6.0
 */
export declare const float: P.Parser<C.Char, number>
/**
 * Parses a double quoted string, with support for escaping double quotes
 * inside it, and returns the inner string. Does not perform any other form
 * of string escaping.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const doubleQuotedString: P.Parser<string, string>
/**
 * @summary
 * Creates a stream from `string` and runs the parser.
 *
 * @category combinators
 * @since 0.6.8
 */
export declare function run(string: string): <A>(p: P.Parser<C.Char, A>) => PR.ParseResult<C.Char, A>
