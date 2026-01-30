import { useParams, Link } from "react-router";
import { mockProducts } from "../data/mockData";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar, Store, ArrowLeft, Tag } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../axiosSetup";
import { Product } from "../types";

export default function ProductDetail() {
  const { id } = useParams();
  const {
    data: product,
    isPending,
    error,
  } = useQuery({
    retry: false,
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await api.get(`/products`, {
        params: {id}
      });

      return data?.data as Product;
    },
  });

    if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading products…</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 dark:text-white">
            Product not found
          </h2>
          <Link to="/">
            <Button>
              <ArrowLeft className="size-4 mr-2" />
              Back to search
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              <ArrowLeft className="size-3 sm:size-4 mr-2" />
              Back to search
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Product Details */}
      <main className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Product Image */}
          <div className="relative aspect-square bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden transition-colors">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount && (
              <Badge className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-red-500 text-sm sm:text-lg px-2 sm:px-3 py-1">
                -{product.discount}%
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4 sm:p-8 transition-colors">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 dark:text-white">
              {product.name}
            </h1>

            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
              {product.description}
            </p>

            {/* Price Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 transition-colors">
              <div className="flex items-baseline gap-2 sm:gap-3 mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
                  €{product.price_eur.toFixed(2)}
                </span>
                {product.old_price_eur && (
                  <span className="text-lg sm:text-xl text-gray-400 dark:text-gray-500 line-through">
                    €{product.old_price_eur.toFixed(2)}
                  </span>
                )}
              </div>
              {product.discount && (
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
                  You save €
                  {(product.old_price_eur! - product.price_eur).toFixed(2)} (
                  {product.discount}% off)
                </p>
              )}
            </div>

            {/* Store Info */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
                <Store className="size-4 sm:size-5 text-gray-600 dark:text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Available at
                  </p>
                  <p className="text-sm sm:text-base font-semibold dark:text-white">
                    {product.supermarket.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
                <Tag className="size-4 sm:size-5 text-gray-600 dark:text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Category
                  </p>
                  <p className="text-sm sm:text-base font-semibold dark:text-white">
                    {product.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
                <Calendar className="size-4 sm:size-5 text-gray-600 dark:text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Valid period
                  </p>
                  <p className="text-sm sm:text-base font-semibold dark:text-white">
                    {new Date(product.brochure.valid_from).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(
                      product.brochure.valid_until,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
