"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var E = __importStar(require("fp-ts/Either"));
var M = __importStar(require("fp-ts/lib/Monoid"));
var O = __importStar(require("fp-ts/lib/Option"));
var pipeable_1 = require("fp-ts/lib/pipeable");
var C = __importStar(require("./char"));
var P = __importStar(require("./Parser"));
var S = __importStar(require("./Stream"));
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Matches the exact string provided.
 *
 * @category constructors
 * @since 0.6.0
 */
exports.string = function (s) {
    return P.expected(P.ChainRec.chainRec(s, function (acc) {
        return pipeable_1.pipe(charAt(0, acc), O.fold(function () { return P.of(E.right(s)); }, function (c) {
            return pipeable_1.pipe(C.char(c), P.chain(function () { return P.of(E.left(acc.slice(1))); }));
        }));
    }), JSON.stringify(s));
};
function oneOf(F) {
    return function (ss) {
        return F.reduce(ss, P.fail(), function (p, s) {
            return pipeable_1.pipe(p, P.alt(function () { return exports.string(s); }));
        });
    };
}
exports.oneOf = oneOf;
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * @category destructors
 * @since 0.6.0
 */
exports.fold = M.fold(P.getMonoid(M.monoidString));
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 0.6.0
 */
exports.maybe = P.maybe(M.monoidString);
/**
 * Matches the given parser zero or more times, returning a string of the
 * entire match
 *
 * @category combinators
 * @since 0.6.0
 */
exports.many = function (parser) { return exports.maybe(exports.many1(parser)); };
/**
 * Matches the given parser one or more times, returning a string of the
 * entire match
 *
 * @category combinators
 * @since 0.6.0
 */
exports.many1 = function (parser) {
    return pipeable_1.pipe(P.many1(parser), P.map(function (nea) { return nea.join(''); }));
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
exports.spaces = C.many(C.space);
/**
 * Matches one or more whitespace characters.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.spaces1 = C.many1(C.space);
/**
 * Matches zero or more non-whitespace characters.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.notSpaces = C.many(C.notSpace);
/**
 * Matches one or more non-whitespace characters.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.notSpaces1 = C.many1(C.notSpace);
var fromString = function (s) {
    var n = +s;
    return isNaN(n) || s === '' ? O.none : O.some(n);
};
/**
 * @category combinators
 * @since 0.6.0
 */
exports.int = P.expected(pipeable_1.pipe(exports.fold([exports.maybe(C.char('-')), C.many1(C.digit)]), P.map(function (s) { return +s; })), 'an integer');
/**
 * @category combinators
 * @since 0.6.0
 */
exports.float = P.expected(pipeable_1.pipe(exports.fold([exports.maybe(C.char('-')), C.many(C.digit), exports.maybe(exports.fold([C.char('.'), C.many1(C.digit)]))]), P.chain(function (s) {
    return pipeable_1.pipe(fromString(s), O.fold(function () { return P.fail(); }, P.succeed));
})), 'a float');
/**
 * Parses a double quoted string, with support for escaping double quotes
 * inside it, and returns the inner string. Does not perform any other form
 * of string escaping.
 *
 * @category combinators
 * @since 0.6.0
 */
exports.doubleQuotedString = P.surroundedBy(C.char('"'))(exports.many(P.either(exports.string('\\"'), function () { return C.notChar('"'); })));
/**
 * @summary
 * Creates a stream from `string` and runs the parser.
 *
 * @category combinators
 * @since 0.6.8
 */
function run(string) {
    return function (p) { return p(S.stream(string.split(''))); };
}
exports.run = run;
