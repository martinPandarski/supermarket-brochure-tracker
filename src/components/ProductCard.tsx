import { Link } from "react-router";
import { Product } from "../types";
import { Badge } from "./ui/badge";
import { Calendar, Store } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
        {/* Product Image */}
  <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
  <img
    src={product.image_url}
    alt={product.name}
    loading="lazy"
    decoding="async"
    className="
      max-w-[85%]
      max-h-[85%]
      object-contain
      blur-[0.15px]
    "
  />

  {product.discount && (
    <Badge className="absolute top-2 right-2 bg-red-500 text-xs sm:text-sm">
      -{product.discount}%
    </Badge>
  )}
</div>


        {/* Product Details */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold line-clamp-2 text-sm sm:text-base dark:text-white">{product.name}</h3>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {product.description}
          </p>

          <div className="mt-auto">
            {/* Price */}
            <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
              <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                €{product.price_eur?.toFixed(2)}
              </span>
              {product.old_price_eur && (
                <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 line-through">
                  €{product.old_price_eur?.toFixed(2)}
                </span>
              )}
            </div>

            {/* Store and Category */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
              <Store className="size-3 sm:size-4 shrink-0" />
              <span className="truncate">{product.supermarket.name}</span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span className="truncate">{product.category}</span>
            </div>

            {/* Valid dates */}
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="size-3 shrink-0" />
              <span className="truncate">
                {new Date(product.brochure.valid_from).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                {new Date(product.brochure.valid_until).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}