/**
 * OnFresh API Response Types
 */

export interface DatabaseHealth {
  engine: string;
  name: string;
  status: 'connected' | 'disconnected' | 'unhealthy';
  error_detail?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded';
  service: string;
  version: string;
  timestamp: string;
  database: DatabaseHealth;
}

export interface CategorySummary {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  is_active: boolean;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export interface QuantityPriceTier {
  id: number;
  min_quantity: number;
  price_per_unit: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  package_weight: string;
  package_unit: string;
  display_weight: string;
  price: string;
  retail_price?: string;
  wholesale_price?: string | null;
  effective_wholesale_price?: string;
  minimum_order_quantity: number;
  is_available: boolean;
  is_available_retail?: boolean;
  is_available_wholesale?: boolean;
  price_tiers?: QuantityPriceTier[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: CategorySummary;
  short_description: string;
  description?: string;
  main_image: string | null;
  ingredients?: string;
  shelf_life?: string;
  is_active: boolean;
  is_featured: boolean;
  min_price: string | null;
  max_price: string | null;
  min_wholesale_price?: string | null;
  max_wholesale_price?: string | null;
  variants: ProductVariant[];
  all_variants?: ProductVariant[];
  created_at: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading?: boolean;
}

// ==========================================
// Phase 4: Authentication & Customer Types
// ==========================================

export type UserRole = 'customer' | 'staff' | 'admin';

export type CustomerType = 'individual' | 'business';

export type WholesaleStatus = 'none' | 'pending' | 'approved' | 'rejected';

export type BusinessType =
  | 'retail_shop'
  | 'supermarket'
  | 'bakery'
  | 'distributor'
  | 'restaurant'
  | 'other';

export interface Address {
  id: number;
  address_type: 'billing' | 'shipping';
  address_type_display?: string;
  recipient_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerProfile {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  customer_type: CustomerType;
  customer_type_display?: string;
  wholesale_status: WholesaleStatus;
  wholesale_status_display?: string;
  is_wholesale_approved: boolean;
  rejection_reason?: string;
  business_name: string;
  business_type: BusinessType;
  business_type_display?: string;
  contact_person: string;
  phone_number: string;
  gstin: string;
  addresses?: Address[];
  created_at?: string;
  updated_at?: string;
}

export interface CalculatedPricingItem {
  variant_id: number;
  sku: string;
  product_name: string;
  package_weight: number;
  package_unit: string;
  display_weight: string;
  quantity: number;
  moq: number;
  moq_satisfied: boolean;
  retail_unit_price: number;
  effective_unit_price: number;
  rule_applied: string;
  line_total: number;
}

export interface PricingCalculationResponse {
  status: 'success' | 'error';
  customer_segment: 'retail' | 'wholesale';
  is_wholesale_approved: boolean;
  all_moq_met: boolean;
  warnings: string[];
  subtotal: number;
  currency: string;
  items: CalculatedPricingItem[];
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  staff_roles?: string[];
  primary_role?: string;
  is_staff: boolean;
  is_superuser?: boolean;
  is_active: boolean;
  date_joined: string;
  profile?: CustomerProfile | null;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message?: string;
  user?: User;
  detail?: string;
  errors?: Record<string, string[] | string>;
}

// ==========================================
// Phase 5: Cart, Checkout & Order Management
// ==========================================

export interface CartItem {
  id?: number;
  variant_id: number;
  sku: string;
  product_name: string;
  product_slug: string;
  image: string | null;
  package_weight: number;
  package_unit: string;
  display_weight: string;
  quantity: number;
  moq: number;
  moq_met: boolean;
  retail_unit_price: number;
  unit_price: number;
  line_subtotal: number;
  line_total: number;
  line_discount: number;
  pricing_rule_applied: string;
  errors?: string[];
}

export interface Cart {
  id?: number;
  items: CartItem[];
  items_count: number;
  subtotal: number;
  discount_amount: number;
  delivery_charge: number;
  tax_amount: number;
  total_amount: number;
  free_delivery_threshold: number;
  amount_for_free_delivery: number;
  customer_segment: 'retail' | 'wholesale';
  is_wholesale_approved: boolean;
  is_valid: boolean;
  errors: string[];
  currency: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready_for_dispatch'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'partially_paid'
  | 'paid'
  | 'failed'
  | 'refunded';

export type PaymentMethod = 'cod' | 'bank_transfer' | 'online';

export interface OrderItemSnapshot {
  id: number;
  product_name: string;
  sku: string;
  package_weight: string | number;
  package_unit: string;
  display_weight: string;
  quantity: number;
  unit_price: string | number;
  retail_price: string | number;
  discount_amount: string | number;
  line_total: string | number;
  pricing_rule_applied: string;
}

export interface OrderStatusHistoryItem {
  id: number;
  old_status: string;
  new_status: string;
  changed_by_email?: string | null;
  notes?: string;
  created_at: string;
}

export interface PaymentTransaction {
  id: number;
  transaction_id: string;
  idempotency_key?: string | null;
  payment_method: string;
  amount: string | number;
  status: string;
  gateway_provider: string;
  gateway_payload?: Record<string, unknown>;
  created_at: string;
}

export interface OrderSummary {
  id: number;
  order_number: string;
  customer_email: string;
  customer_name?: string;
  customer_type: CustomerType;
  order_status: OrderStatus;
  order_status_display: string;
  payment_status: PaymentStatus;
  payment_status_display: string;
  payment_method: PaymentMethod;
  payment_method_display: string;
  total_amount: string | number;
  items_count: number;
  created_at: string;
}

export interface OrderDetail extends OrderSummary {
  customer_name: string;
  shipping_address_snapshot: {
    recipient_name: string;
    phone_number: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  billing_address_snapshot: {
    recipient_name: string;
    phone_number: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  subtotal: string | number;
  discount_amount: string | number;
  delivery_charge: string | number;
  tax_amount: string | number;
  customer_notes?: string;
  admin_notes?: string;
  can_cancel: boolean;
  items: OrderItemSnapshot[];
  status_history: OrderStatusHistoryItem[];
  payments: PaymentTransaction[];
  updated_at: string;
}

export interface CheckoutPayload {
  shipping_address_id?: number;
  billing_address_id?: number;
  new_shipping_address?: {
    recipient_name: string;
    phone_number: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    district?: string;
    state?: string;
    pincode: string;
  };
  new_billing_address?: {
    recipient_name: string;
    phone_number: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    district?: string;
    state?: string;
    pincode: string;
  };
  same_as_shipping?: boolean;
  payment_method: PaymentMethod;
  customer_notes?: string;
}

export interface CheckoutResponse {
  status: 'success' | 'error';
  message: string;
  order?: OrderDetail;
  payment_instructions?: {
    status: string;
    payment_method: string;
    transaction_id?: string;
    amount?: number;
    order_number?: string;
    bank_details?: Record<string, string>;
    instructions?: string;
  };
  errors?: Record<string, string[]>;
}

// ==========================================
// Phase 6: Inventory, Batches & Movements
// ==========================================

export interface StockItem {
  id: number;
  variant_id: number;
  sku: string;
  product_name: string;
  product_slug: string;
  category_name: string;
  package_weight: string | number;
  package_unit: string;
  display_weight: string;
  quantity_on_hand: number;
  reserved_quantity: number;
  available_to_sell: number;
  low_stock_threshold: number;
  is_low_stock: boolean;
  is_out_of_stock: boolean;
  last_reorder_date?: string | null;
  updated_at: string;
}

export type BatchStatus =
  | 'in_production'
  | 'completed'
  | 'quarantined'
  | 'exhausted'
  | 'recalled';

export interface ProductionBatch {
  id: number;
  batch_number: string;
  product_id: number;
  product_name: string;
  variant_id: number;
  variant_sku: string;
  package_weight: string | number;
  package_unit: string;
  display_weight: string;
  production_date: string;
  expiry_date: string;
  manufactured_quantity: number;
  remaining_quantity: number;
  status: BatchStatus;
  status_display: string;
  days_until_expiry: number;
  is_expired: boolean;
  is_expiring_soon: boolean;
  is_stock_added: boolean;
  manufacturing_notes?: string;
  created_by_email?: string | null;
  created_at: string;
  updated_at: string;
}

export type StockMovementType =
  | 'production_in'
  | 'purchase_in'
  | 'order_reservation'
  | 'reservation_release'
  | 'order_dispatch'
  | 'customer_return'
  | 'damage'
  | 'expiry'
  | 'adjustment';

export interface StockMovement {
  id: number;
  variant_id: number;
  sku: string;
  product_name: string;
  display_weight: string;
  batch_number?: string | null;
  movement_type: StockMovementType;
  movement_type_display: string;
  quantity: number;
  reference_number: string;
  reason: string;
  balance_after: number;
  user_email?: string | null;
  created_at: string;
}

export interface InventorySummary {
  total_skus: number;
  total_units_on_hand: number;
  total_reserved_units: number;
  total_available_units: number;
  low_stock_count: number;
  out_of_stock_count: number;
  expiring_batches_count: number;
  expired_batches_count: number;
  last_30_days_stock_in: number;
  last_30_days_stock_out: number;
}

export interface ExpiryReport {
  warning_threshold_days: number;
  expiring_soon_count: number;
  expired_count: number;
  expiring_soon_batches: ProductionBatch[];
  expired_batches: ProductionBatch[];
}

// ==========================================
// Phase 7: Analytics, Invoices, Staff & Admin Types
// ==========================================

export interface DashboardSummary {
  total_revenue: number;
  gross_order_value: number;
  collected_payments: number;
  outstanding_payments: number;
  cancelled_amount: number;
  aov: number;
  total_orders: number;
  valid_orders_count: number;
  pending_orders: number;
  confirmed_orders: number;
  processing_orders: number;
  dispatched_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_individual_customers: number;
  total_wholesale_customers: number;
  pending_wholesale_applications: number;
  total_active_products: number;
  low_stock_variants: number;
  out_of_stock_variants: number;
  active_production_batches: number;
  recent_orders: Array<{
    id: number;
    order_number: string;
    customer_email: string;
    customer_name: string;
    customer_type: 'individual' | 'business';
    order_status: string;
    order_status_display: string;
    payment_status: string;
    payment_status_display: string;
    total_amount: number;
    created_at: string;
  }>;
  period: string;
  start_date: string;
  end_date: string;
}

export interface SalesAnalyticsTimeSeriesPoint {
  date: string;
  label: string;
  total_revenue: number;
  retail_revenue: number;
  wholesale_revenue: number;
  order_count: number;
  retail_orders: number;
  wholesale_orders: number;
  aov: number;
}

export interface PaymentBreakdown {
  method: string;
  display: string;
  total: number;
  count: number;
}

export interface SalesAnalyticsData {
  time_series: SalesAnalyticsTimeSeriesPoint[];
  payment_breakdown: PaymentBreakdown[];
  interval: string;
  start_date: string;
  end_date: string;
}

export interface B2BvsB2CSegmentMetrics {
  total_revenue: number;
  order_count: number;
  aov: number;
  distinct_customers: number;
  repeat_customers: number;
  repeat_rate: number;
  top_products: Array<{
    product_name: string;
    units_sold: number;
    revenue: number;
  }>;
  package_performance: Array<{
    size: string;
    units_sold: number;
    revenue: number;
  }>;
}

export interface B2BvsB2CComparisonData {
  retail: B2BvsB2CSegmentMetrics;
  wholesale: B2BvsB2CSegmentMetrics;
  revenue_split: {
    retail_percent: number;
    wholesale_percent: number;
  };
  start_date: string;
  end_date: string;
}

export interface ProductPerformanceItem {
  product_name: string;
  sku: string;
  package_size: string;
  total_units: number;
  total_revenue: number;
  order_count: number;
}

export interface CategorySalesItem {
  category_id: number;
  category_name: string;
  units_sold: number;
  total_revenue: number;
}

export interface ProductAnalyticsData {
  best_selling: ProductPerformanceItem[];
  least_selling: ProductPerformanceItem[];
  category_sales: CategorySalesItem[];
  start_date: string;
  end_date: string;
}

export interface AddressSnapshot {
  recipient_name?: string;
  phone_number?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  order_number: string;
  order_status?: string;
  order_status_display?: string;
  invoice_date: string;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  status_display: string;
  company_name: string;
  company_address: string;
  company_gstin: string;
  company_phone: string;
  company_email: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_type: 'individual' | 'business';
  customer_type_display: string;
  business_name?: string;
  customer_gstin?: string;
  billing_address?: AddressSnapshot;
  shipping_address?: AddressSnapshot;
  subtotal: string;
  discount_amount: string;
  tax_rate_percent: string;
  cgst_amount: string;
  sgst_amount: string;
  igst_amount: string;
  tax_amount: string;
  delivery_charge: string;
  grand_total: string;
  payment_status: string;
  payment_method: string;
  payment_reference?: string;
  notes?: string;
  items?: Array<{
    id: number;
    product_name: string;
    sku: string;
    package_weight: string;
    package_unit: string;
    display_weight: string;
    quantity: number;
    unit_price: string;
    retail_price: string;
    discount_amount: string;
    line_total: string;
    pricing_rule_applied?: string;
  }>;
  created_at: string;
  updated_at?: string;
}

export interface AdminCustomer {
  id: number;
  user_id: number;
  email: string;
  full_name: string;
  customer_type: 'individual' | 'business';
  customer_type_display: string;
  wholesale_status: 'none' | 'pending' | 'approved' | 'rejected';
  wholesale_status_display: string;
  business_name?: string;
  business_type?: string;
  business_type_display?: string;
  contact_person?: string;
  phone_number: string;
  gstin?: string;
  is_active: boolean;
  date_joined: string;
  orders_count: number;
  total_spent: string;
  last_order_date: string | null;
  created_at: string;
  addresses?: Address[];
}

export interface StaffMember {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  roles: string[];
  primary_role: string;
  date_joined: string;
  last_login: string | null;
}

export interface StaffRole {
  name: string;
  description: string;
}

// -------------------------------------------------------------
// Phase 8: Manufacturing, Raw Materials, Suppliers & Production
// -------------------------------------------------------------

export interface RawMaterialCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  materials_count: number;
  created_at: string;
}

export interface RawMaterialMovement {
  id: number;
  material: number;
  material_code: string;
  material_name: string;
  movement_type: 'purchase_in' | 'production_consumption' | 'wastage' | 'adjustment' | 'return';
  quantity: string;
  unit: string;
  unit_cost: string;
  total_cost: string;
  balance_after: string;
  reference_number: string;
  notes: string;
  created_by_name: string;
  created_at: string;
}

export interface RawMaterial {
  id: number;
  material_code: string;
  name: string;
  category: number;
  category_name: string;
  unit_of_measure: 'kg' | 'g' | 'l' | 'ml' | 'pcs' | 'roll' | 'bundle' | 'box';
  current_stock: string;
  minimum_stock_level: string;
  reorder_quantity: string;
  unit_cost: string;
  storage_location: string;
  shelf_life_days: number | null;
  is_active: boolean;
  notes: string;
  is_low_stock: boolean;
  is_out_of_stock: boolean;
  total_stock_value: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierMaterial {
  id: number;
  supplier: number;
  material: number;
  material_name: string;
  material_code: string;
  unit_of_measure: string;
  supplier_material_code: string;
  quoted_price: string;
  minimum_order_qty: string;
  is_preferred: boolean;
}

export interface Supplier {
  id: number;
  supplier_code: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  gstin: string;
  payment_terms: string;
  lead_time_days: number;
  is_active: boolean;
  notes: string;
  supplied_materials?: SupplierMaterial[];
  total_orders: number;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: number;
  purchase_order: number;
  material: number;
  material_code: string;
  material_name: string;
  unit_of_measure: string;
  ordered_quantity: string;
  received_quantity: string;
  unit_cost: string;
  tax_rate: string;
  total_cost: string;
}

export interface SupplierPayment {
  id: number;
  purchase_order: number;
  payment_number: string;
  payment_date: string;
  amount: string;
  payment_method: 'bank_transfer' | 'upi' | 'cheque' | 'cash' | 'credit';
  reference_number: string;
  notes: string;
  created_by_name: string;
  created_at: string;
}

export interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier: number;
  supplier_name: string;
  supplier_phone: string;
  supplier_gstin: string;
  order_date: string;
  expected_delivery_date: string | null;
  received_date: string | null;
  status: 'draft' | 'ordered' | 'partially_received' | 'received' | 'cancelled';
  subtotal: string;
  tax_amount: string;
  total_amount: string;
  is_stock_added: boolean;
  payment_status: 'unpaid' | 'partially_paid' | 'paid';
  amount_paid: string;
  vendor_invoice_number: string;
  notes: string;
  created_by_name: string;
  items: PurchaseOrderItem[];
  payments: SupplierPayment[];
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: number;
  recipe: number;
  material: number;
  material_code: string;
  material_name: string;
  quantity: string;
  unit: string;
  wastage_percentage: string;
  unit_cost: string;
  effective_quantity: string;
  effective_cost: string;
}

export interface RecipePackaging {
  id: number;
  recipe: number;
  packaging_material: number;
  material_code: string;
  material_name: string;
  quantity: string;
  unit: string;
  notes: string;
  unit_cost: string;
  effective_cost: string;
}

export interface Recipe {
  id: number;
  recipe_code: string;
  name: string;
  product: number;
  product_name: string;
  variant: number | null;
  variant_sku: string | null;
  variant_weight: string | null;
  version: number;
  is_active: boolean;
  batch_output_quantity: string;
  output_unit: string;
  target_variant_units: number;
  estimated_labor_cost: string;
  estimated_overhead_cost: string;
  instructions: string;
  notes: string;
  ingredients: RecipeIngredient[];
  packaging_materials: RecipePackaging[];
  estimated_raw_material_cost: string;
  estimated_packaging_cost: string;
  estimated_total_cost: string;
  estimated_cost_per_unit: string;
  created_at: string;
  updated_at: string;
}

export interface ProductionMaterialConsumption {
  id: number;
  production_order: number;
  material: number;
  material_code: string;
  material_name: string;
  planned_quantity: string;
  actual_quantity: string;
  wastage_quantity: string;
  unit: string;
  unit_cost: string;
  total_cost: string;
}

export interface ProductionPackagingConsumption {
  id: number;
  production_order: number;
  material: number;
  material_code: string;
  material_name: string;
  planned_quantity: string;
  actual_quantity: string;
  wastage_quantity: string;
  unit: string;
  unit_cost: string;
  total_cost: string;
}

export interface QualityInspection {
  id: number;
  inspection_number: string;
  production_order: number;
  order_number: string;
  production_batch: number | null;
  batch_number: string | null;
  inspector: number | null;
  inspector_name: string;
  inspection_date: string;
  sample_size: number;
  appearance_status: 'pass' | 'marginal' | 'fail';
  taste_crispness_status: 'pass' | 'marginal' | 'fail';
  moisture_status: 'pass' | 'fail';
  packaging_seal_status: 'pass' | 'fail';
  label_batch_verification: 'pass' | 'fail';
  overall_result: 'pending' | 'passed' | 'failed' | 'quarantined';
  release_status: 'quarantined' | 'released' | 'rejected';
  defect_notes: string;
  corrective_actions: string;
  created_at: string;
  updated_at: string;
}

export interface ProductionOrder {
  id: number;
  order_number: string;
  recipe: number;
  recipe_code: string;
  recipe_name: string;
  product: number;
  product_name: string;
  variant: number;
  variant_sku: string;
  variant_weight: string;
  planned_quantity: number;
  produced_quantity: number;
  rejected_quantity: number;
  start_date: string;
  completion_date: string | null;
  status: 'planned' | 'approved' | 'in_progress' | 'quality_check' | 'completed' | 'cancelled';
  raw_material_cost: string;
  packaging_cost: string;
  labor_cost: string;
  overhead_cost: string;
  total_production_cost: string;
  cost_per_unit: string;
  notes: string;
  created_by_name: string;
  production_batch: number | null;
  batch_number: string | null;
  batch_status: string | null;
  material_consumptions: ProductionMaterialConsumption[];
  packaging_consumptions: ProductionPackagingConsumption[];
  inspections: QualityInspection[];
  created_at: string;
  updated_at: string;
}

export interface ManufacturingKPIs {
  total_raw_materials: number;
  low_stock_materials: number;
  out_of_stock_materials: number;
  total_raw_valuation: number;
  active_production_orders: number;
  completed_orders_count: number;
  pending_qc_count: number;
  pending_purchase_orders: number;
}

export interface ManufacturingDashboardData {
  kpis: ManufacturingKPIs;
  recent_production_orders: ProductionOrder[];
  low_stock_materials: RawMaterial[];
  recent_quality_inspections: QualityInspection[];
}

export interface IngredientAvailabilityCheck {
  is_sufficient: boolean;
  target_units: number;
  scaling_factor: number;
  requirements: Array<{
    material_id: number;
    material_code: string;
    name: string;
    category: string;
    required_quantity: string;
    available_quantity: string;
    unit: string;
    has_shortfall: boolean;
    shortfall_quantity: string;
  }>;
  shortfalls: Array<{
    material_id: number;
    material_code: string;
    name: string;
    category: string;
    required_quantity: string;
    available_quantity: string;
    unit: string;
    has_shortfall: boolean;
    shortfall_quantity: string;
  }>;
}



