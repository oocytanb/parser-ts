/**
 * @since 0.6.0
 */
import { Alt2 } from 'fp-ts/es6/Alt'
import { Alternative2 } from 'fp-ts/es6/Alternative'
import { Applicative2 } from 'fp-ts/es6/Applicative'
import { ChainRec2 } from 'fp-ts/es6/ChainRec'
import { Functor2 } from 'fp-ts/es6/Functor'
import { Monad2 } from 'fp-ts/es6/Monad'
import { Monoid } from 'fp-ts/es6/Monoid'
import * as NEA from 'fp-ts/es6/NonEmptyArray'
import * as O from 'fp-ts/es6/Option'
import * as RNEA from 'fp-ts/es6/ReadonlyNonEmptyArray'
import { Semigroup } from 'fp-ts/es6/Semigroup'
import { Lazy, Predicate, Refinement } from 'fp-ts/es6/function'
import { ParseResult } from './ParseResult'
import { Stream } from './Stream'
/**
 * @category model
 * @since 0.6.0
 */
export interface Parser<I, A> {
  (i: Stream<I>): ParseResult<I, A>
}
/**
 * The `succeed` parser constructor creates a parser which will simply
 * return the value provided as its argument, without consuming any input.
 *
 * This is equivalent to the monadic `of`.
 *
 * @category constructors
 * @since 0.6.0
 */
export declare const succeed: <I, A>(a: A) => Parser<I, A>
/**
 * The `fail` parser will just fail immediately without consuming any input
 *
 * @category constructors
 * @since 0.6.0
 */
export declare const fail: <I, A = never>() => Parser<I, A>
/**
 * The `failAt` parser will fail immediately without consuming any input,
 * but will report the failure at the provided input position.
 *
 * @category constructors
 * @since 0.6.0
 */
export declare const failAt: <I, A = never>(i: Stream<I>) => Parser<I, A>
/**
 * The `sat` parser constructor takes a predicate function, and will consume
 * a single character if calling that predicate function with the character
 * as its argument returns `true`. If it returns `false`, the parser will
 * fail.
 *
 * @category constructors
 * @since 0.6.0
 */
export declare const sat: <I>(predicate: Predicate<I>) => Parser<I, I>
/**
 * A parser combinator which returns the provided parser unchanged, except
 * that if it fails, the provided error message will be returned in the
 * ParseError`.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const expected: <I, A>(p: Parser<I, A>, message: string) => Parser<I, A>
/**
 * The `item` parser consumes a single value, regardless of what it is,
 * and returns it as its result.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const item: <I>() => Parser<I, I>
/**
 * The `cut` parser combinator takes a parser and produces a new parser for
 * which all errors are fatal, causing either to stop trying further
 * parsers and return immediately with a fatal error.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const cut: <I, A>(p: Parser<I, A>) => Parser<I, A>
/**
 * Takes two parsers `p1` and `p2`, returning a parser which will match
 * `p1` first, discard the result, then either match `p2` or produce a fatal
 * error.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const cutWith: <I, A, B>(p1: Parser<I, A>, p2: Parser<I, B>) => Parser<I, B>
/**
 * The `seq` combinator takes a parser, and a function which will receive
 * the result of that parser if it succeeds, and which should return another
 * parser, which will be run immediately after the initial parser. In this
 * way, you can join parsers together in a sequence, producing more complex
 * parsers.
 *
 * This is equivalent to the monadic `chain` operation.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const seq: <I, A, B>(fa: Parser<I, A>, f: (a: A) => Parser<I, B>) => Parser<I, B>
/**
 * The `either` combinator takes two parsers, runs the first on the input
 * stream, and if that fails, it will backtrack and attempt the second
 * parser on the same input. Basically, try parser 1, then try parser 2.
 *
 * If the first parser fails with an error flagged as fatal (see `cut`),
 * the second parser will not be attempted.
 *
 * This is equivalent to the `alt` operation.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const either: <I, A>(p: Parser<I, A>, f: () => Parser<I, A>) => Parser<I, A>
/**
 * Converts a parser into one which will return the point in the stream where
 * it started parsing in addition to its parsed value.
 *
 * Useful if you want to keep track of where in the input stream a parsed
 * token came from.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const withStart: <I, A>(p: Parser<I, A>) => Parser<I, [A, Stream<I>]>
/**
 * The `maybe` parser combinator creates a parser which will run the provided
 * parser on the input, and if it fails, it will returns the empty value (as
 * defined by `empty`) as a result, without consuming any input.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const maybe: <A>(M: Monoid<A>) => <I>(p: Parser<I, A>) => Parser<I, A>
/**
 * Matches the end of the stream.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const eof: <I>() => Parser<I, void>
/**
 * The `many` combinator takes a parser, and returns a new parser which will
 * run the parser repeatedly on the input stream until it fails, returning
 * a list of the result values of each parse operation as its result, or the
 * empty list if the parser never succeeded.
 *
 * Read that as "match this parser zero or more times and give me a list of
 * the results."
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const many: <I, A>(p: Parser<I, A>) => Parser<I, A[]>
/**
 * The `many1` combinator is just like the `many` combinator, except it
 * requires its wrapped parser to match at least once. The resulting list is
 * thus guaranteed to contain at least one value.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const many1: <I, A>(parser: Parser<I, A>) => Parser<I, NEA.NonEmptyArray<A>>
/**
 * Matches the provided parser `p` zero or more times, but requires the
 * parser `sep` to match once in between each match of `p`. In other words,
 * use `sep` to match separator characters in between matches of `p`.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const sepBy: <I, A, B>(sep: Parser<I, A>, p: Parser<I, B>) => Parser<I, B[]>
/**
 * Matches the provided parser `p` one or more times, but requires the
 * parser `sep` to match once in between each match of `p`. In other words,
 * use `sep` to match separator characters in between matches of `p`.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const sepBy1: <I, A, B>(sep: Parser<I, A>, p: Parser<I, B>) => Parser<I, NEA.NonEmptyArray<B>>
/**
 * Like `sepBy1`, but cut on the separator, so that matching a `sep` not
 * followed by a `p` will cause a fatal error.
 *
 * @category combinators
 * @since 0.6.0
 */
export declare const sepByCut: <I, A, B>(sep: Parser<I, A>, p: Parser<I, B>) => Parser<I, NEA.NonEmptyArray<B>>
/**
 * Filters the result of a parser based upon a `Refinement` or a `Predicate`.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { run } from 'parser-ts/code-frame'
 * import * as C from 'parser-ts/char'
 * import * as P from 'parser-ts/Parser'
 *
 * const parser = P.expected(
 *   pipe(
 *     P.item<C.Char>(),
 *     P.filter((c) => c !== 'a')
 *   ),
 *  'anything except "a"'
 * )
 *
 * run(parser, 'a')
 * // {  _tag: 'Left', left: '> 1 | a\n    | ^ Expected: anything except "a"' }
 *
 * run(parser, 'b')
 * // { _tag: 'Right', right: 'b' }
 *
 * @category combinators
 * @since 0.6.10
 */
export declare const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): <I>(p: Parser<I, A>) => Parser<I, B>
  <A>(predicate: Predicate<A>): <I>(p: Parser<I, A>) => Parser<I, A>
}
/**
 * Matches the provided parser `p` that occurs between the provided `left` and `right` parsers.
 *
 * `p` is polymorphic in its return type, because in general bounds and actual parser could return different types.
 *
 * @category combinators
 * @since 0.6.4
 */
export declare const between: <I, A>(left: Parser<I, A>, right: Parser<I, A>) => <B>(p: Parser<I, B>) => Parser<I, B>
/**
 * Matches the provided parser `p` that is surrounded by the `bound` parser. Shortcut for `between(bound, bound)`.
 *
 * @category combinators
 * @since 0.6.4
 */
export declare const surroundedBy: <I, A>(bound: Parser<I, A>) => <B>(p: Parser<I, B>) => Parser<I, B>
/**
 * Takes a `Parser` and tries to match it without consuming any input.
 *
 * @example
 * import { run } from 'parser-ts/code-frame'
 * import * as P from 'parser-ts/Parser'
 * import * as S from 'parser-ts/string'
 *
 * const parser = S.fold([
 *   S.string('hello '),
 *    P.lookAhead(S.string('world')),
 *    S.string('wor')
 * ])
 *
 * run(parser, 'hello world')
 * // { _tag: 'Right', right: 'hello worldwor' }
 *
 * @category combinators
 * @since 0.6.6
 */
export declare const lookAhead: <I, A>(p: Parser<I, A>) => Parser<I, A>
/**
 * Takes a `Predicate` and continues parsing until the given `Predicate` is satisfied.
 *
 * @example
 * import * as C from 'parser-ts/char'
 * import { run } from 'parser-ts/code-frame'
 * import * as P from 'parser-ts/Parser'
 *
 * const parser = P.takeUntil((c: C.Char) => c === 'w')
 *
 * run(parser, 'hello world')
 * // { _tag: 'Right', right: [ 'h', 'e', 'l', 'l', 'o', ' ' ] }
 *
 * @category combinators
 * @since 0.6.6
 */
export declare const takeUntil: <I>(predicate: Predicate<I>) => Parser<I, Array<I>>
/**
 * Returns `Some<A>` if the specified parser succeeds, otherwise returns `None`.
 *
 * @example
 * import * as C from 'parser-ts/char'
 * import { run } from 'parser-ts/code-frame'
 * import * as P from 'parser-ts/Parser'
 *
 * const a = P.sat((c: C.Char) => c === 'a')
 * const parser = P.optional(a)
 *
 * run(parser, 'a')
 * // { _tag: 'Right', right: { _tag: 'Some', value: 'a' } }
 *
 * run(parser, 'b')
 * // { _tag: 'Left', left: { _tag: 'None' } }
 *
 * @category combinators
 * @since 0.6.10
 */
export declare const optional: <I, A>(parser: Parser<I, A>) => Parser<I, O.Option<A>>
/**
 * The `manyTill` combinator takes a value `parser` and a `terminator` parser, and
 * returns a new parser that will run the value `parser` repeatedly on the input
 * stream, returning a list of the result values of each parse operation as its
 * result, or the empty list if the parser never succeeded.
 *
 * @example
 * import * as C from 'parser-ts/char'
 * import { run } from 'parser-ts/code-frame'
 * import * as P from 'parser-ts/Parser'
 *
 * const parser = P.manyTill(C.letter, C.char('-'))
 *
 * run(parser, 'abc-')
 * // { _tag: 'Right', right: [ 'a', 'b', 'c' ] }
 *
 * run(parser, '-')
 * // { _tag: 'Right', right: [] }
 *
 * @category combinators
 * @since 0.6.11
 */
export declare const manyTill: <I, A, B>(parser: Parser<I, A>, terminator: Parser<I, B>) => Parser<I, readonly A[]>
/**
 * The `many1Till` combinator is just like the `manyTill` combinator, except it
 * requires the value `parser` to match at least once before the `terminator`
 * parser. The resulting list is thus guaranteed to contain at least one value.
 *
 * @example
 * import * as C from 'parser-ts/char'
 * import { run } from 'parser-ts/code-frame'
 * import * as P from 'parser-ts/Parser'
 *
 * const parser = P.many1Till(C.letter, C.char('-'))
 *
 * run(parser, 'abc-')
 * // { _tag: 'Right', right: [ 'a', 'b', 'c' ] }
 *
 * run(parser, '-')
 * // { _tag: 'Left', left: '> 1 | -\n    | ^ Expected: a letter' }
 *
 * @category combinators
 * @since 0.6.11
 */
export declare const many1Till: <I, A, B>(
  parser: Parser<I, A>,
  terminator: Parser<I, B>
) => Parser<I, RNEA.ReadonlyNonEmptyArray<A>>
/**
 * @category Functor
 * @since 0.6.7
 */
export declare const map: <A, B>(f: (a: A) => B) => <I>(fa: Parser<I, A>) => Parser<I, B>
/**
 * @category Apply
 * @since 0.6.7
 */
export declare const ap: <I, A>(fa: Parser<I, A>) => <B>(fab: Parser<I, (a: A) => B>) => Parser<I, B>
/**
 * @category Apply
 * @since 0.6.7
 */
export declare const apFirst: <I, B>(fb: Parser<I, B>) => <A>(fa: Parser<I, A>) => Parser<I, A>
/**
 * @category Apply
 * @since 0.6.7
 */
export declare const apSecond: <I, B>(fb: Parser<I, B>) => <A>(fa: Parser<I, A>) => Parser<I, B>
/**
 * @category Applicative
 * @since 0.6.7
 */
export declare const of: <I, A>(a: A) => Parser<I, A>
/**
 * @category Monad
 * @since 0.6.7
 */
export declare const chain: <I, A, B>(f: (a: A) => Parser<I, B>) => (ma: Parser<I, A>) => Parser<I, B>
/**
 * @category Monad
 * @since 0.6.7
 */
export declare const chainFirst: <I, A, B>(f: (a: A) => Parser<I, B>) => (ma: Parser<I, A>) => Parser<I, A>
/**
 * @category Alt
 * @since 0.6.7
 */
export declare const alt: <I, A>(that: Lazy<Parser<I, A>>) => (fa: Parser<I, A>) => Parser<I, A>
/**
 * @category Monad
 * @since 0.6.7
 */
export declare const flatten: <I, A>(mma: Parser<I, Parser<I, A>>) => Parser<I, A>
/**
 * @category Alternative
 * @since 0.6.7
 */
export declare const zero: <I, A>() => Parser<I, A>
/**
 * @category instances
 * @since 0.6.0
 */
export declare const URI = 'Parser'
/**
 * @category instances
 * @since 0.6.0
 */
export declare type URI = typeof URI
declare module 'fp-ts/HKT' {
  interface URItoKind2<E, A> {
    Parser: Parser<E, A>
  }
}
/**
 * @category instances
 * @since 0.6.7
 */
export declare const getSemigroup: <I, A>(S: Semigroup<A>) => Semigroup<Parser<I, A>>
/**
 * @category instances
 * @since 0.6.0
 */
export declare const getMonoid: <I, A>(M: Monoid<A>) => Monoid<Parser<I, A>>
/**
 * @category instances
 * @since 0.6.7
 */
export declare const Functor: Functor2<URI>
/**
 * @category instances
 * @since 0.6.7
 */
export declare const Applicative: Applicative2<URI>
/**
 * @category instances
 * @since 0.6.7
 */
export declare const Monad: Monad2<URI>
/**
 * @category instances
 * @since 0.6.11
 */
export declare const ChainRec: ChainRec2<URI>
/**
 * @category instances
 * @since 0.6.7
 */
export declare const Alt: Alt2<URI>
/**
 * @category instances
 * @since 0.6.7
 */
export declare const Alternative: Alternative2<URI>
/**
 * @category instances
 * @since 0.6.7
 */
export declare const parser: Monad2<URI> & Alternative2<URI>
/**
 * @since 0.6.8
 */
export declare const bindTo: <N extends string>(name: N) => <I, A>(fa: Parser<I, A>) => Parser<I, { [K in N]: A }>
/**
 * @since 0.6.8
 */
export declare const bind: <N extends string, I, A, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Parser<I, B>
) => (fa: Parser<I, A>) => Parser<I, { [K in N | keyof A]: K extends keyof A ? A[K] : B }>
