export type PaginationMeta = {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
}

export type PaginatedResource<TKey extends string, TItem> = {
    [K in TKey]: TItem[]
} & {
    pagination: PaginationMeta
}
