export type ProductStatus = "available" | "coming_soon" | "sold_out";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_kobo: number | null;
  status: ProductStatus;
  stock_count: number;
  initial_stock: number;
  reserved_count: number;
  made_to_order: boolean;
  sort_order: number;
  images: string[];
};

export type OrderStatus =
  | "placed"
  | "payment_confirmed"
  | "preparing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderStatusEvent = {
  status: string;
  note: string | null;
  created_at: string;
};

export type OrderSummary = {
  order_code: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  courier_name: string | null;
  tracking_number: string | null;
  total_kobo: number;
  created_at: string;
  history: OrderStatusEvent[];
};
