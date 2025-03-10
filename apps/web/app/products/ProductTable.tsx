"use client";

import { ProductCard } from "./ProductCard";
import { useProductTable } from "./hooks/useProductTable";
import { PaginationFooter } from "./components/PaginationFooter";
import { LoadingSkeleton } from "../layout/Skeleton";

export function ProductsTable() {
  const {
    data,
    isLoading,
    handleFirstPage,
    handlePrevPage,
    handleNextPage,
    handleLastPage,
    handleChangePageSize,
    isFirstDisabled,
    isPrevDisabled,
    isNextDisabled,
    isLastDisabled,
    currentPage,
    isError,
    isInitialLoading,
  } = useProductTable();

  if (isInitialLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {data?.products && (
        <div className="mb-8">
          <div className="pb-16">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
              <h2
                id="explore-products"
                className="text-2xl font-semibold text-gray-800"
              >
                Explore Products
              </h2>
              <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                <label
                  htmlFor="pageSize"
                  className="text-sm text-gray-600 whitespace-nowrap"
                >
                  Items per page:
                </label>
                <select
                  id="pageSize"
                  className="border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  value={data.pagination.limit}
                  onChange={(e) => handleChangePageSize(Number(e.target.value))}
                  disabled={isLoading}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>

            <div className="relative min-h-[400px]">
              <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isLoading ? "opacity-40" : "opacity-100"}`}
              >
                {data.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isNew={product.id % 5 === 0}
                  />
                ))}
              </div>

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Pagination Footer */}
          <PaginationFooter
            currentPage={currentPage}
            totalItems={data.totalCount}
            itemsPerPage={data.pagination.limit}
            onFirstPage={handleFirstPage}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onLastPage={handleLastPage}
            isFirstDisabled={isFirstDisabled}
            isPrevDisabled={isPrevDisabled}
            isNextDisabled={isNextDisabled}
            isLastDisabled={isLastDisabled}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
