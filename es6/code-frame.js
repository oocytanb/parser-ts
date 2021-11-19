/**
 * @since 0.6.0
 */
import { bimap } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import { stream } from './Stream';
var codeFrameColumns = require('@babel/code-frame').codeFrameColumns;
var lineTerminatorRegex = /^\r\n$|^[\n\r]$/;
var getLocation = function (source, cursor) {
    var line = 1;
    var column = 1;
    var i = 0;
    while (i < cursor) {
        i++;
        var c = source.charAt(i);
        if (lineTerminatorRegex.test(c)) {
            line++;
            column = 1;
        }
        else {
            column++;
        }
    }
    return {
        start: {
            line: line,
            column: column
        }
    };
};
/**
 * Returns a pretty printed error message using `@babel/code-frame`
 *
 * @since 0.6.0
 */
export var run = function (p, source) {
    return pipe(p(stream(source.split(''))), bimap(function (err) {
        return codeFrameColumns(source, getLocation(source, err.input.cursor), {
            message: 'Expected: ' + err.expected.join(', ')
        });
    }, function (succ) { return succ.value; }));
};
