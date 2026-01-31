import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ShoppingBag, SlidersHorizontal } from "lucide-react"

import { SearchBar } from "../components/SearchBar"
import { FilterPanel } from "../components/FilterPanel"
import { ProductCard } from "../components/ProductCard"
import { ThemeToggle } from "../components/ThemeToggle"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination"

import { api } from "../../axiosSetup"
import { Product } from "../types"
import { useDebounce } from "../hooks/useDebounce"
import getPaginationRange from "../utils/paginationHelper"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStore, setSelectedStore] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([1, 100])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebounce(searchQuery, 400)

  // Reset page when filters/search change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, selectedStore, selectedCategory, priceRange])

  const { data, isPending, error } = useQuery({
    retry: false,
    queryKey: [
      "products",
      debouncedSearch,
      selectedStore,
      selectedCategory,
      priceRange,
      page,
    ],
    queryFn: async () => {
      const { data } = await api.get("/products", {
        params: {
          search: debouncedSearch || undefined,
          supermarket: selectedStore || undefined,
          category: selectedCategory || undefined,
          min_price: priceRange[0],
          max_price: priceRange[1],
          page,
        },
      })

      return {
        products: data.data as Product[],
        meta: data.meta,
      }
    },
  })

  const products = data?.products ?? []
  const meta = data?.meta

  const handleResetFilters = () => {
    setSelectedStore("")
    setSelectedCategory("")
    setPriceRange([1, 100])
  }

  const activeFiltersCount =
    (selectedStore ? 1 : 0) +
    (selectedCategory ? 1 : 0) +
    (priceRange[0] > 1 || priceRange[1] < 100 ? 1 : 0)

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Зареждане…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Неуспешно зареждане</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="size-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl dark:text-white">Brochure Search</h1>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex gap-2">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {/* Mobile Filters */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden relative h-12 w-12"
                >
                  <SlidersHorizontal className="size-5" />
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[320px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>

                <div className="mt-4">
                  <FilterPanel
                    selectedStore={selectedStore}
                    selectedCategory={selectedCategory}
                    priceRange={priceRange}
                    onStoreToggle={setSelectedStore}
                    onCategoryToggle={setSelectedCategory}
                    onPriceRangeChange={setPriceRange}
                    onReset={handleResetFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <FilterPanel
                selectedStore={selectedStore}
                selectedCategory={selectedCategory}
                priceRange={priceRange}
                onStoreToggle={setSelectedStore}
                onCategoryToggle={setSelectedCategory}
                onPriceRangeChange={setPriceRange}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          {/* Products */}
          <main className="lg:col-span-3">
            <div className="mb-4 text-gray-600 dark:text-gray-400">
              {meta?.total ?? products.length} product
              {meta?.total !== 1 ? "s" : ""} found
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                <ShoppingBag className="size-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400">
                  No products found
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
            {meta && meta.total_pages > 1 && (
  <Pagination className="mt-8">
    <PaginationContent className="flex-wrap">
      {/* Previous */}
      <PaginationItem>
        <PaginationPrevious
            size='default'
          href="#"
          aria-disabled={page === 1}
          onClick={(e) => {
            e.preventDefault()
            if (page > 1) setPage(page - 1)
          }}
        />
      </PaginationItem>

      {/* Page numbers with ellipsis */}
      {getPaginationRange(page, meta.total_pages).map((item, index) =>
        item === "ellipsis" ? (
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        ) : (
          <PaginationItem key={item}>
            <PaginationLink
            size='default'
              href="#"
              isActive={page === item}
              onClick={(e) => {
                e.preventDefault()
                setPage(item)
              }}
            >
              {item}
            </PaginationLink>
          </PaginationItem>
        )
      )}

      {/* Next */}
      <PaginationItem>
        <PaginationNext
            size='default'
          href="#"
          aria-disabled={page === meta.total_pages}
          onClick={(e) => {
            e.preventDefault()
            if (page < meta.total_pages) setPage(page + 1)
          }}
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
)}

              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
