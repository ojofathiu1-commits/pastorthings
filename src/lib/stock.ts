import type { Product } from "./types";

export function availableUnits(product: Pick<Product, "stock_count" | "reserved_count">) {
  return Math.max(0, product.stock_count - product.reserved_count);
}
