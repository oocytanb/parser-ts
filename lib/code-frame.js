"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @since 0.6.0
 */
var Either_1 = require("fp-ts/lib/Either");
var pipeable_1 = require("fp-ts/lib/pipeable");
var Stream_1 = require("./Stream");
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
exports.run = function (p, source) {
    return pipeable_1.pipe(p(Stream_1.stream(source.split(''))), Either_1.bimap(function (err) {
        return codeFrameColumns(source, getLocation(source, err.input.cursor), {
            message: 'Expected: ' + err.expected.join(', ')
        });
    }, function (succ) { return succ.value; }));
};
