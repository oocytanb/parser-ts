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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var A = __importStar(require("fp-ts/lib/Array"));
var ChainRec_1 = require("fp-ts/lib/ChainRec");
var E = __importStar(require("fp-ts/lib/Either"));
var NEA = __importStar(require("fp-ts/lib/NonEmptyArray"));
var O = __importStar(require("fp-ts/lib/Option"));
var RA = __importStar(require("fp-ts/lib/ReadonlyArray"));
var RNEA = __importStar(require("fp-ts/lib/ReadonlyNonEmptyArray"));
var function_1 = require("fp-ts/lib/function");
var pipeable_1 = require("fp-ts/lib/pipeable");
var ParseResult_1 = require("./ParseResult");
var Stream_1 = require("./Stream");
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
exports.succeed = function (a) { return function (i) { return ParseResult_1.success(a, i, i); }; };
/**
 * The `fail` parser will just fail immediately without consuming any input
 *
 * @category constructors
 * @since 0.6.0
 */
exports.fail = function () { return function (i) { return ParseResult_1.error(i); }; };
/**
 * The `failAt` parser will fail immediately without consuming any input,
 * but will report the failure at the provided input position.
 *
 * @category constructors
 * @since 0.6.0
 */
exports.failAt = function (i) { return function () { return ParseResult_1.error(i); }; };
/**
 * The `sat` parser constructor takes a predicate function, and will consume
 * a single character if calling that predicate function with the character
 * as its argument returns `true`. If it returns `false`, the parser will
 * fail.
 *
 * @category constructors
 * @since 0.6.0
 */
exports.sat = function (predicate) {
    return pipeable_1.pipe(exports.withStart(exports.item()), exports.chain(function (_a) {
        var a = _a[0], start = _a[1];
        return (predicate(a) ? exports.of(a) : exports.failAt(start));
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
exports.expected = function (p, message) { return function (i) {
    return pipeable_1.pipe(p(i), E.mapLeft(function (err) { return ParseResult_1.withExpected(err, [message]); }));
}; };
/**
 * The `item` parser consumes a single value, regardless of what it is,
 * and returns it as its result.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.item = function () { return function (i) {
    return pipeable_1.pipe(Stream_1.getAndNext(i), O.fold(function () { return ParseResult_1.error(i); }, function (_a) {
        var value = _a.value, next = _a.next;
        return ParseResult_1.success(value, next, i);
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
exports.cut = function (p) { return function (i) { return pipeable_1.pipe(p(i), E.mapLeft(ParseResult_1.escalate)); }; };
/**
 * Takes two parsers `p1` and `p2`, returning a parser which will match
 * `p1` first, discard the result, then either match `p2` or produce a fatal
 * error.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.cutWith = function (p1, p2) {
    return pipeable_1.pipe(p1, exports.apSecond(exports.cut(p2)));
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
exports.seq = function (fa, f) { return function (i) {
    return pipeable_1.pipe(fa(i), E.chain(function (s) {
        return pipeable_1.pipe(f(s.value)(s.next), E.chain(function (next) { return ParseResult_1.success(next.value, next.next, i); }));
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
exports.either = function (p, f) { return function (i) {
    var e = p(i);
    if (E.isRight(e)) {
        return e;
    }
    if (e.left.fatal) {
        return e;
    }
    return pipeable_1.pipe(f()(i), E.mapLeft(function (err) { return ParseResult_1.extend(e.left, err); }));
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
exports.withStart = function (p) { return function (i) {
    return pipeable_1.pipe(p(i), E.map(function (s) { return (__assign({}, s, { value: [s.value, i] })); }));
}; };
/**
 * The `maybe` parser combinator creates a parser which will run the provided
 * parser on the input, and if it fails, it will returns the empty value (as
 * defined by `empty`) as a result, without consuming any input.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.maybe = function (M) { return exports.alt(function () { return exports.of(M.empty); }); };
/**
 * Matches the end of the stream.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.eof = function () {
    return exports.expected(function (i) { return (Stream_1.atEnd(i) ? ParseResult_1.success(undefined, i, i) : ParseResult_1.error(i)); }, 'end of file');
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
exports.many = function (p) {
    return pipeable_1.pipe(exports.many1(p), exports.alt(function () { return exports.of(A.empty); }));
};
/**
 * The `many1` combinator is just like the `many` combinator, except it
 * requires its wrapped parser to match at least once. The resulting list is
 * thus guaranteed to contain at least one value.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.many1 = function (parser) {
    return pipeable_1.pipe(parser, exports.chain(function (head) {
        return chainRec_(NEA.of(head), function (acc) {
            return pipeable_1.pipe(parser, exports.map(function (a) { return E.left(NEA.snoc(acc, a)); }), exports.alt(function () { return exports.of(E.right(acc)); }));
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
exports.sepBy = function (sep, p) {
    var nil = exports.of(A.empty);
    return pipeable_1.pipe(exports.sepBy1(sep, p), exports.alt(function () { return nil; }));
};
/**
 * Matches the provided parser `p` one or more times, but requires the
 * parser `sep` to match once in between each match of `p`. In other words,
 * use `sep` to match separator characters in between matches of `p`.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.sepBy1 = function (sep, p) {
    return pipeable_1.pipe(p, exports.chain(function (head) {
        return pipeable_1.pipe(exports.many(pipeable_1.pipe(sep, exports.apSecond(p))), exports.map(function (tail) { return NEA.cons(head, tail); }));
    }));
};
/**
 * Like `sepBy1`, but cut on the separator, so that matching a `sep` not
 * followed by a `p` will cause a fatal error.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.sepByCut = function (sep, p) {
    return pipeable_1.pipe(p, exports.chain(function (head) {
        return pipeable_1.pipe(exports.many(exports.cutWith(sep, p)), exports.map(function (tail) { return NEA.cons(head, tail); }));
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
exports.filter = function (predicate) { return function (p) { return function (i) {
    return pipeable_1.pipe(p(i), E.chain(function (next) { return (predicate(next.value) ? E.right(next) : ParseResult_1.error(i)); }));
}; }; };
/**
 * Matches the provided parser `p` that occurs between the provided `left` and `right` parsers.
 *
 * `p` is polymorphic in its return type, because in general bounds and actual parser could return different types.
 *
 * @category combinators
 * @since 0.6.4
 */
exports.between = function (left, right) { return function (p) {
    return pipeable_1.pipe(left, exports.chain(function () { return p; }), exports.chainFirst(function () { return right; }));
}; };
/**
 * Matches the provided parser `p` that is surrounded by the `bound` parser. Shortcut for `between(bound, bound)`.
 *
 * @category combinators
 * @since 0.6.4
 */
exports.surroundedBy = function (bound) {
    return exports.between(bound, bound);
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
exports.lookAhead = function (p) { return function (i) {
    return pipeable_1.pipe(p(i), E.chain(function (next) { return ParseResult_1.success(next.value, i, i); }));
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
exports.takeUntil = function (predicate) { return exports.many(exports.sat(function_1.not(predicate))); };
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
exports.optional = function (parser) {
    return pipeable_1.pipe(parser, exports.map(O.some), exports.alt(function () { return exports.succeed(O.none); }));
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
exports.manyTill = function (parser, terminator) {
    return pipeable_1.pipe(terminator, exports.map(function () { return RA.empty; }), exports.alt(function () { return exports.many1Till(parser, terminator); }));
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
exports.many1Till = function (parser, terminator) {
    return pipeable_1.pipe(parser, exports.chain(function (x) {
        return chainRec_(RNEA.of(x), function (acc) {
            return pipeable_1.pipe(terminator, exports.map(function () { return E.right(acc); }), exports.alt(function () {
                return pipeable_1.pipe(parser, exports.map(function (a) { return E.left(RNEA.snoc(acc, a)); }));
            }));
        });
    }));
};
var map_ = function (ma, f) { return function (i) {
    return pipeable_1.pipe(ma(i), E.map(function (s) { return (__assign({}, s, { value: f(s.value) })); }));
}; };
var ap_ = function (mab, ma) { return chain_(mab, function (f) { return map_(ma, f); }); };
var chain_ = function (ma, f) { return exports.seq(ma, f); };
var chainRec_ = function (a, f) {
    var split = function (start) { return function (result) {
        return E.isLeft(result.value)
            ? E.left({ value: result.value.left, stream: result.next })
            : E.right(ParseResult_1.success(result.value.right, result.next, start));
    }; };
    return function (start) {
        return ChainRec_1.tailRec({ value: a, stream: start }, function (state) {
            var result = f(state.value)(state.stream);
            if (E.isLeft(result)) {
                return E.right(ParseResult_1.error(state.stream, result.left.expected, result.left.fatal));
            }
            return split(start)(result.right);
        });
    };
};
var alt_ = function (fa, that) { return exports.either(fa, that); };
// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------
/**
 * @category Functor
 * @since 0.6.7
 */
exports.map = function (f) { return function (fa) { return map_(fa, f); }; };
/**
 * @category Apply
 * @since 0.6.7
 */
exports.ap = function (fa) { return function (fab) {
    return ap_(fab, fa);
}; };
/**
 * @category Apply
 * @since 0.6.7
 */
exports.apFirst = function (fb) { return function (fa) {
    return ap_(map_(fa, function (a) { return function () { return a; }; }), fb);
}; };
/**
 * @category Apply
 * @since 0.6.7
 */
exports.apSecond = function (fb) { return function (fa) {
    return ap_(map_(fa, function () { return function (b) { return b; }; }), fb);
}; };
/**
 * @category Applicative
 * @since 0.6.7
 */
exports.of = exports.succeed;
/**
 * @category Monad
 * @since 0.6.7
 */
exports.chain = function (f) { return function (ma) {
    return chain_(ma, f);
}; };
/**
 * @category Monad
 * @since 0.6.7
 */
exports.chainFirst = function (f) { return function (ma) {
    return chain_(ma, function (a) { return map_(f(a), function () { return a; }); });
}; };
/**
 * @category Alt
 * @since 0.6.7
 */
exports.alt = function (that) { return function (fa) { return alt_(fa, that); }; };
/**
 * @category Monad
 * @since 0.6.7
 */
exports.flatten = function (mma) { return chain_(mma, function_1.identity); };
/**
 * @category Alternative
 * @since 0.6.7
 */
exports.zero = exports.fail;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 0.6.0
 */
exports.URI = 'Parser';
/**
 * @category instances
 * @since 0.6.7
 */
exports.getSemigroup = function (S) { return ({
    concat: function (x, y) {
        return ap_(map_(x, function (x) { return function (y) { return S.concat(x, y); }; }), y);
    }
}); };
/**
 * @category instances
 * @since 0.6.0
 */
exports.getMonoid = function (M) { return (__assign({}, exports.getSemigroup(M), { empty: exports.succeed(M.empty) })); };
/**
 * @category instances
 * @since 0.6.7
 */
exports.Functor = {
    URI: exports.URI,
    map: map_
};
/**
 * @category instances
 * @since 0.6.7
 */
exports.Applicative = {
    URI: exports.URI,
    map: map_,
    ap: ap_,
    of: exports.of
};
/**
 * @category instances
 * @since 0.6.7
 */
exports.Monad = {
    URI: exports.URI,
    map: map_,
    ap: ap_,
    of: exports.of,
    chain: chain_
};
/**
 * @category instances
 * @since 0.6.11
 */
exports.ChainRec = {
    URI: exports.URI,
    map: map_,
    ap: ap_,
    chain: chain_,
    chainRec: chainRec_
};
/**
 * @category instances
 * @since 0.6.7
 */
exports.Alt = {
    URI: exports.URI,
    map: map_,
    alt: alt_
};
/**
 * @category instances
 * @since 0.6.7
 */
exports.Alternative = {
    URI: exports.URI,
    map: map_,
    of: exports.of,
    ap: ap_,
    alt: alt_,
    zero: exports.fail
};
/**
 * @category instances
 * @since 0.6.7
 */
exports.parser = {
    URI: exports.URI,
    map: map_,
    of: exports.of,
    ap: ap_,
    chain: chain_,
    alt: alt_,
    zero: exports.fail
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
exports.bindTo = function (name) { return function (fa) {
    return pipeable_1.pipe(fa, exports.map(function (a) { return bind_({}, name, a); }));
}; };
/**
 * @since 0.6.8
 */
exports.bind = function (name, f) { return function (fa) {
    return pipeable_1.pipe(fa, exports.chain(function (a) {
        return pipeable_1.pipe(f(a), exports.map(function (b) { return bind_(a, name, b); }));
    }));
}; };
