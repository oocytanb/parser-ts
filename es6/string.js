import * as E from 'fp-ts/Either';
import * as M from 'fp-ts/es6/Monoid';
import * as O from 'fp-ts/es6/Option';
import { pipe } from 'fp-ts/es6/pipeable';
import * as C from './char';
import * as P from './Parser';
import * as S from './Stream';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Matches the exact string provided.
 *
 * @category constructors
 * @since 0.6.0
 */
export var string = function (s) {
    return P.expected(P.ChainRec.chainRec(s, function (acc) {
        return pipe(charAt(0, acc), O.fold(function () { return P.of(E.right(s)); }, function (c) {
            return pipe(C.char(c), P.chain(function () { return P.of(E.left(acc.slice(1))); }));
        }));
    }), JSON.stringify(s));
};
export function oneOf(F) {
    return function (ss) {
        return F.reduce(ss, P.fail(), function (p, s) {
            return pipe(p, P.alt(function () { return string(s); }));
        });
    };
}
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * @category destructors
 * @since 0.6.0
 */
export var fold = M.fold(P.getMonoid(M.monoidString));
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 0.6.0
 */
export var maybe = P.maybe(M.monoidString);
/**
 * Matches the given parser zero or more times, returning a string of the
 * entire match
 *
 * @category combinators
 * @since 0.6.0
 */
export var many = function (parser) { return maybe(many1(parser)); };
/**
 * Matches the given parser one or more times, returning a string of the
 * entire match
 *
 * @category combinators
 * @since 0.6.0
 */
export var many1 = function (parser) {
    return pipe(P.many1(parser), P.map(function (nea) { return nea.join(''); }));
};
var charAt = function (index, s) {
    return index >= 0 && index < s.length ? O.some(s.charAt(index)) : O.none;
};
/**
 * Matches zero or more whitespace characters.
 *
 * @category combinators
 * @since 0.6.0
 */
export var spaces = C.many(C.space);
/**
 * Matches one or more whitespace characters.
 *
 * @category combinators
 * @since 0.6.0
 */
export var spaces1 = C.many1(C.space);
/**
 * Matches zero or more non-whitespace characters.
 *
 * @category combinators
 * @since 0.6.0
 */
export var notSpaces = C.many(C.notSpace);
/**
 * Matches one or more non-whitespace characters.
 *
 * @category combinators
 * @since 0.6.0
 */
export var notSpaces1 = C.many1(C.notSpace);
var fromString = function (s) {
    var n = +s;
    return isNaN(n) || s === '' ? O.none : O.some(n);
};
/**
 * @category combinators
 * @since 0.6.0
 */
export var int = P.expected(pipe(fold([maybe(C.char('-')), C.many1(C.digit)]), P.map(function (s) { return +s; })), 'an integer');
/**
 * @category combinators
 * @since 0.6.0
 */
export var float = P.expected(pipe(fold([maybe(C.char('-')), C.many(C.digit), maybe(fold([C.char('.'), C.many1(C.digit)]))]), P.chain(function (s) {
    return pipe(fromString(s), O.fold(function () { return P.fail(); }, P.succeed));
})), 'a float');
/**
 * Parses a double quoted string, with support for escaping double quotes
 * inside it, and returns the inner string. Does not perform any other form
 * of string escaping.
 *
 * @category combinators
 * @since 0.6.0
 */
export var doubleQuotedString = P.surroundedBy(C.char('"'))(many(P.either(string('\\"'), function () { return C.notChar('"'); })));
/**
 * @summary
 * Creates a stream from `string` and runs the parser.
 *
 * @category combinators
 * @since 0.6.8
 */
export function run(string) {
    return function (p) { return p(S.stream(string.split(''))); };
}
