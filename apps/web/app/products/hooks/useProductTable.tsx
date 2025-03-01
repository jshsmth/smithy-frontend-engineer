import { useState, useEffect } from "react";
import { trpc } from "../../providers";
import { keepPreviousData } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export function useProductTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState({
    limit: searchParams ? Number(searchParams.get("limit")) || 10 : 10,
    page: searchParams ? Number(searchParams.get("page")) || 1 : 1,
  });

  const productsQuery = trpc.product.getProducts.useQuery(query, {
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", query.page.toString());
    params.set("limit", query.limit.toString());

    // Update URL without refreshing the page
    router.push(`?${params.toString()}`, { scroll: false });
  }, [query, router]);

  const handlePrevPage = () => {
    if (!productsQuery.isSuccess) return;

    const newPage = Math.max(1, query.page - 1);
    setQuery({
      ...query,
      page: newPage,
    });
  };

  const handleNextPage = () => {
    if (!productsQuery.isSuccess || !productsQuery.data?.hasMore) return;

    const newPage = query.page + 1;
    setQuery({
      ...query,
      page: newPage,
    });
  };

  const handleChangePageSize = (newLimit: number) => {
    setQuery({
      limit: newLimit,
      page: 1, // Reset to first page when changing page size
    });
  };

  const currentPage = query.page - 1; // Convert to 0-based for display purposes
  const isPrevDisabled = query.page === 1 || productsQuery.isFetching;
  const isNextDisabled =
    productsQuery.isFetching ||
    !productsQuery.isSuccess ||
    !productsQuery.data?.hasMore;

  return {
    data: productsQuery.data,
    isLoading: productsQuery.isLoading,
    handlePrevPage,
    handleNextPage,
    handleChangePageSize,
    isPrevDisabled,
    isNextDisabled,
    currentPage,
    isError: productsQuery.isError,
  };
}
