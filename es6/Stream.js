/**
 * @since 0.6.0
 */
import { getEq as getArrayEq, lookup } from 'fp-ts/es6/Array';
import { fromEquals } from 'fp-ts/es6/Eq';
import { map } from 'fp-ts/es6/Option';
import { pipe } from 'fp-ts/es6/pipeable';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 0.6.0
 */
export var stream = function (buffer, cursor) {
    if (cursor === void 0) { cursor = 0; }
    return ({
        buffer: buffer,
        cursor: cursor
    });
};
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * @category destructors
 * @since 0.6.0
 */
export var get = function (s) { return lookup(s.cursor, s.buffer); };
/**
 * @category destructors
 * @since 0.6.0
 */
export var atEnd = function (s) { return s.cursor >= s.buffer.length; };
/**
 * @category destructors
 * @since 0.6.0
 */
export var getAndNext = function (s) {
    return pipe(get(s), map(function (a) { return ({ value: a, next: { buffer: s.buffer, cursor: s.cursor + 1 } }); }));
};
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 0.6.0
 */
export var getEq = function (E) {
    var EA = getArrayEq(E);
    return fromEquals(function (x, y) { return x.cursor === y.cursor && EA.equals(x.buffer, y.buffer); });
};
