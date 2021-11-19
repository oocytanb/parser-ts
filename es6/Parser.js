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
import * as A from 'fp-ts/es6/Array';
import { tailRec } from 'fp-ts/es6/ChainRec';
import * as E from 'fp-ts/es6/Either';
import * as NEA from 'fp-ts/es6/NonEmptyArray';
import * as O from 'fp-ts/es6/Option';
import * as RA from 'fp-ts/es6/ReadonlyArray';
import * as RNEA from 'fp-ts/es6/ReadonlyNonEmptyArray';
import { identity, not } from 'fp-ts/es6/function';
import { pipe } from 'fp-ts/es6/pipeable';
import { error, escalate, extend, success, withExpected } from './ParseResult';
import { atEnd, getAndNext } from './Stream';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * The `succeed` parser constructor creates a parser which will simply
 * return the value provided as its argument, without consuming any input.
 *
 * This is equivalent to the monadic `of`.
 *
 * @category constructors
 * @since 0.6.0
 */
export var succeed = function (a) { return function (i) { return success(a, i, i); }; };
/**
 * The `fail` parser will just fail immediately without consuming any input
 *
 * @category constructors
 * @since 0.6.0
 */
export var fail = function () { return function (i) { return error(i); }; };
/**
 * The `failAt` parser will fail immediately without consuming any input,
 * but will report the failure at the provided input position.
 *
 * @category constructors
 * @since 0.6.0
 */
export var failAt = function (i) { return function () { return error(i); }; };
/**
 * The `sat` parser constructor takes a predicate function, and will consume
 * a single character if calling that predicate function with the character
 * as its argument returns `true`. If it returns `false`, the parser will
 * fail.
 *
 * @category constructors
 * @since 0.6.0
 */
export var sat = function (predicate) {
    return pipe(withStart(item()), chain(function (_a) {
        var a = _a[0], start = _a[1];
        return (predicate(a) ? of(a) : failAt(start));
    }));
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * A parser combinator which returns the provided parser unchanged, except
 * that if it fails, the provided error message will be returned in the
 * ParseError`.
 *
 * @category combinators
 * @since 0.6.0
 */
export var expected = function (p, message) { return function (i) {
    return pipe(p(i), E.mapLeft(function (err) { return withExpected(err, [message]); }));
}; };
/**
 * The `item` parser consumes a single value, regardless of what it is,
 * and returns it as its result.
 *
 * @category combinators
 * @since 0.6.0
 */
export var item = function () { return function (i) {
    return pipe(getAndNext(i), O.fold(function () { return error(i); }, function (_a) {
        var value = _a.value, next = _a.next;
        return success(value, next, i);
    }));
}; };
/**
 * The `cut` parser combinator takes a parser and produces a new parser for
 * which all errors are fatal, causing either to stop trying further
 * parsers and return immediately with a fatal error.
 *
 * @category combinators
 * @since 0.6.0
 */
export var cut = function (p) { return function (i) { return pipe(p(i), E.mapLeft(escalate)); }; };
/**
 * Takes two parsers `p1` and `p2`, returning a parser which will match
 * `p1` first, discard the result, then either match `p2` or produce a fatal
 * error.
 *
 * @category combinators
 * @since 0.6.0
 */
export var cutWith = function (p1, p2) {
    return pipe(p1, apSecond(cut(p2)));
};
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
export var seq = function (fa, f) { return function (i) {
    return pipe(fa(i), E.chain(function (s) {
        return pipe(f(s.value)(s.next), E.chain(function (next) { return success(next.value, next.next, i); }));
    }));
}; };
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
export var either = function (p, f) { return function (i) {
    var e = p(i);
    if (E.isRight(e)) {
        return e;
    }
    if (e.left.fatal) {
        return e;
    }
    return pipe(f()(i), E.mapLeft(function (err) { return extend(e.left, err); }));
}; };
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
export var withStart = function (p) { return function (i) {
    return pipe(p(i), E.map(function (s) { return (__assign({}, s, { value: [s.value, i] })); }));
}; };
/**
 * The `maybe` parser combinator creates a parser which will run the provided
 * parser on the input, and if it fails, it will returns the empty value (as
 * defined by `empty`) as a result, without consuming any input.
 *
 * @category combinators
 * @since 0.6.0
 */
export var maybe = function (M) { return alt(function () { return of(M.empty); }); };
/**
 * Matches the end of the stream.
 *
 * @category combinators
 * @since 0.6.0
 */
export var eof = function () {
    return expected(function (i) { return (atEnd(i) ? success(undefined, i, i) : error(i)); }, 'end of file');
};
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
export var many = function (p) {
    return pipe(many1(p), alt(function () { return of(A.empty); }));
};
/**
 * The `many1` combinator is just like the `many` combinator, except it
 * requires its wrapped parser to match at least once. The resulting list is
 * thus guaranteed to contain at least one value.
 *
 * @category combinators
 * @since 0.6.0
 */
export var many1 = function (parser) {
    return pipe(parser, chain(function (head) {
        return chainRec_(NEA.of(head), function (acc) {
            return pipe(parser, map(function (a) { return E.left(NEA.snoc(acc, a)); }), alt(function () { return of(E.right(acc)); }));
        });
    }));
};
/**
 * Matches the provided parser `p` zero or more times, but requires the
 * parser `sep` to match once in between each match of `p`. In other words,
 * use `sep` to match separator characters in between matches of `p`.
 *
 * @category combinators
 * @since 0.6.0
 */
export var sepBy = function (sep, p) {
    var nil = of(A.empty);
    return pipe(sepBy1(sep, p), alt(function () { return nil; }));
};
/**
 * Matches the provided parser `p` one or more times, but requires the
 * parser `sep` to match once in between each match of `p`. In other words,
 * use `sep` to match separator characters in between matches of `p`.
 *
 * @category combinators
 * @since 0.6.0
 */
export var sepBy1 = function (sep, p) {
    return pipe(p, chain(function (head) {
        return pipe(many(pipe(sep, apSecond(p))), map(function (tail) { return NEA.cons(head, tail); }));
    }));
};
/**
 * Like `sepBy1`, but cut on the separator, so that matching a `sep` not
 * followed by a `p` will cause a fatal error.
 *
 * @category combinators
 * @since 0.6.0
 */
export var sepByCut = function (sep, p) {
    return pipe(p, chain(function (head) {
        return pipe(many(cutWith(sep, p)), map(function (tail) { return NEA.cons(head, tail); }));
    }));
};
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
export var filter = function (predicate) { return function (p) { return function (i) {
    return pipe(p(i), E.chain(function (next) { return (predicate(next.value) ? E.right(next) : error(i)); }));
}; }; };
/**
 * Matches the provided parser `p` that occurs between the provided `left` and `right` parsers.
 *
 * `p` is polymorphic in its return type, because in general bounds and actual parser could return different types.
 *
 * @category combinators
 * @since 0.6.4
 */
export var between = function (left, right) { return function (p) {
    return pipe(left, chain(function () { return p; }), chainFirst(function () { return right; }));
}; };
/**
 * Matches the provided parser `p` that is surrounded by the `bound` parser. Shortcut for `between(bound, bound)`.
 *
 * @category combinators
 * @since 0.6.4
 */
export var surroundedBy = function (bound) {
    return between(bound, bound);
};
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
export var lookAhead = function (p) { return function (i) {
    return pipe(p(i), E.chain(function (next) { return success(next.value, i, i); }));
}; };
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
export var takeUntil = function (predicate) { return many(sat(not(predicate))); };
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
export var optional = function (parser) {
    return pipe(parser, map(O.some), alt(function () { return succeed(O.none); }));
};
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
export var manyTill = function (parser, terminator) {
    return pipe(terminator, map(function () { return RA.empty; }), alt(function () { return many1Till(parser, terminator); }));
};
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
export var many1Till = function (parser, terminator) {
    return pipe(parser, chain(function (x) {
        return chainRec_(RNEA.of(x), function (acc) {
            return pipe(terminator, map(function () { return E.right(acc); }), alt(function () {
                return pipe(parser, map(function (a) { return E.left(RNEA.snoc(acc, a)); }));
            }));
        });
    }));
};
var map_ = function (ma, f) { return function (i) {
    return pipe(ma(i), E.map(function (s) { return (__assign({}, s, { value: f(s.value) })); }));
}; };
var ap_ = function (mab, ma) { return chain_(mab, function (f) { return map_(ma, f); }); };
var chain_ = function (ma, f) { return seq(ma, f); };
var chainRec_ = function (a, f) {
    var split = function (start) { return function (result) {
        return E.isLeft(result.value)
            ? E.left({ value: result.value.left, stream: result.next })
            : E.right(success(result.value.right, result.next, start));
    }; };
    return function (start) {
        return tailRec({ value: a, stream: start }, function (state) {
            var result = f(state.value)(state.stream);
            if (E.isLeft(result)) {
                return E.right(error(state.stream, result.left.expected, result.left.fatal));
            }
            return split(start)(result.right);
        });
    };
};
var alt_ = function (fa, that) { return either(fa, that); };
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
/**
 * @category Functor
 * @since 0.6.7
 */
export var map = function (f) { return function (fa) { return map_(fa, f); }; };
/**
 * @category Apply
 * @since 0.6.7
 */
export var ap = function (fa) { return function (fab) {
    return ap_(fab, fa);
}; };
/**
 * @category Apply
 * @since 0.6.7
 */
export var apFirst = function (fb) { return function (fa) {
    return ap_(map_(fa, function (a) { return function () { return a; }; }), fb);
}; };
/**
 * @category Apply
 * @since 0.6.7
 */
export var apSecond = function (fb) { return function (fa) {
    return ap_(map_(fa, function () { return function (b) { return b; }; }), fb);
}; };
/**
 * @category Applicative
 * @since 0.6.7
 */
export var of = succeed;
/**
 * @category Monad
 * @since 0.6.7
 */
export var chain = function (f) { return function (ma) {
    return chain_(ma, f);
}; };
/**
 * @category Monad
 * @since 0.6.7
 */
export var chainFirst = function (f) { return function (ma) {
    return chain_(ma, function (a) { return map_(f(a), function () { return a; }); });
}; };
/**
 * @category Alt
 * @since 0.6.7
 */
export var alt = function (that) { return function (fa) { return alt_(fa, that); }; };
/**
 * @category Monad
 * @since 0.6.7
 */
export var flatten = function (mma) { return chain_(mma, identity); };
/**
 * @category Alternative
 * @since 0.6.7
 */
export var zero = fail;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 0.6.0
 */
export var URI = 'Parser';
/**
 * @category instances
 * @since 0.6.7
 */
export var getSemigroup = function (S) { return ({
    concat: function (x, y) {
        return ap_(map_(x, function (x) { return function (y) { return S.concat(x, y); }; }), y);
    }
}); };
/**
 * @category instances
 * @since 0.6.0
 */
export var getMonoid = function (M) { return (__assign({}, getSemigroup(M), { empty: succeed(M.empty) })); };
/**
 * @category instances
 * @since 0.6.7
 */
export var Functor = {
    URI: URI,
    map: map_
};
/**
 * @category instances
 * @since 0.6.7
 */
export var Applicative = {
    URI: URI,
    map: map_,
    ap: ap_,
    of: of
};
/**
 * @category instances
 * @since 0.6.7
 */
export var Monad = {
    URI: URI,
    map: map_,
    ap: ap_,
    of: of,
    chain: chain_
};
/**
 * @category instances
 * @since 0.6.11
 */
export var ChainRec = {
    URI: URI,
    map: map_,
    ap: ap_,
    chain: chain_,
    chainRec: chainRec_
};
/**
 * @category instances
 * @since 0.6.7
 */
export var Alt = {
    URI: URI,
    map: map_,
    alt: alt_
};
/**
 * @category instances
 * @since 0.6.7
 */
export var Alternative = {
    URI: URI,
    map: map_,
    of: of,
    ap: ap_,
    alt: alt_,
    zero: fail
};
/**
 * @category instances
 * @since 0.6.7
 */
export var parser = {
    URI: URI,
    map: map_,
    of: of,
    ap: ap_,
    chain: chain_,
    alt: alt_,
    zero: fail
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @internal
 */
var bind_ = function (a, name, b) {
    var _a;
    return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
};
/**
 * @since 0.6.8
 */
export var bindTo = function (name) { return function (fa) {
    return pipe(fa, map(function (a) { return bind_({}, name, a); }));
}; };
/**
 * @since 0.6.8
 */
export var bind = function (name, f) { return function (fa) {
    return pipe(fa, chain(function (a) {
        return pipe(f(a), map(function (b) { return bind_(a, name, b); }));
    }));
}; };
