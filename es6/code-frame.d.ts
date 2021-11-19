/**
 * @since 0.6.0
 */
import { Either } from 'fp-ts/es6/Either'
import { Char } from './char'
import { Parser } from './Parser'
/**
 * Returns a pretty printed error message using `@babel/code-frame`
 *
 * @since 0.6.0
 */
export declare const run: <A>(p: Parser<Char, A>, source: string) => Either<string, A>
