import { Either } from 'fp-ts/es6/Either'
import { Stream } from './Stream'
/**
 * @category model
 * @since 0.6.0
 */
export interface ParseError<I> {
  input: Stream<I>
  expected: Array<string>
  fatal: boolean
}
/**
 * @category model
 * @since 0.6.0
 */
export interface ParseSuccess<I, A> {
  value: A
  next: Stream<I>
  start: Stream<I>
}
/**
 * @category model
 * @since 0.6.0
 */
export declare type ParseResult<I, A> = Either<ParseError<I>, ParseSuccess<I, A>>
/**
 * @category constructors
 * @since 0.6.0
 */
export declare const success: <I, A>(value: A, next: Stream<I>, start: Stream<I>) => ParseResult<I, A>
/**
 * @category constructors
 * @since 0.6.0
 */
export declare const error: <I, A = never>(
  input: Stream<I>,
  expected?: Array<string>,
  fatal?: boolean
) => ParseResult<I, A>
/**
 * @category combinators
 * @since 0.6.0
 */
export declare const withExpected: <I>(err: ParseError<I>, expected: Array<string>) => ParseError<I>
/**
 * @category combinators
 * @since 0.6.0
 */
export declare const escalate: <I>(err: ParseError<I>) => ParseError<I>
/**
 * @category combinators
 * @since 0.6.0
 */
export declare const extend: <I>(err1: ParseError<I>, err2: ParseError<I>) => ParseError<I>
