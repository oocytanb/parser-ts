import { Eq } from 'fp-ts/lib/Eq'
import { Option } from 'fp-ts/lib/Option'
/**
 * @category model
 * @since 0.6.0
 */
export interface Stream<A> {
  readonly buffer: Array<A>
  readonly cursor: number
}
/**
 * @category constructors
 * @since 0.6.0
 */
export declare const stream: <A>(buffer: Array<A>, cursor?: number) => Stream<A>
/**
 * @category destructors
 * @since 0.6.0
 */
export declare const get: <A>(s: Stream<A>) => Option<A>
/**
 * @category destructors
 * @since 0.6.0
 */
export declare const atEnd: <A>(s: Stream<A>) => boolean
/**
 * @category destructors
 * @since 0.6.0
 */
export declare const getAndNext: <A>(
  s: Stream<A>
) => Option<{
  value: A
  next: Stream<A>
}>
/**
 * @category instances
 * @since 0.6.0
 */
export declare const getEq: <A>(E: Eq<A>) => Eq<Stream<A>>
