import type { JsonOk } from '#/constants/json'

export type ServerOk<T> = Promise<JsonOk<T>>
