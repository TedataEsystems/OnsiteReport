export interface Pagination {
    currentPage : number;
    itemsPerPage : number;
    totalCount : number;
    totalPages : number;
}

export  class PaginatedResult<T>{
    result : T  = <T>{};
    pagination : Pagination = <Pagination>{};

}