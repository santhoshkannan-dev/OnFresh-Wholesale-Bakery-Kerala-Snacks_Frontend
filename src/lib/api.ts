import {
  HealthCheckResponse,
  Category,
  Product,
  PaginatedResponse,
  User,
  CustomerProfile,
  Address,
  AuthResponse,
  PricingCalculationResponse,
  Cart,
  OrderDetail,
  OrderSummary,
  CheckoutPayload,
  CheckoutResponse,
  StockItem,
  ProductionBatch,
  StockMovement,
  InventorySummary,
  ExpiryReport,
  DashboardSummary,
  SalesAnalyticsData,
  B2BvsB2CComparisonData,
  ProductAnalyticsData,
  Invoice,
  AdminCustomer,
  StaffMember,
  StaffRole,
  RawMaterialCategory,
  RawMaterialMovement,
  RawMaterial,
  Supplier,
  SupplierMaterial,
  PurchaseOrder,
  PurchaseOrderItem,
  SupplierPayment,
  Recipe,
  ProductionOrder,
  QualityInspection,
  ManufacturingDashboardData,
  IngredientAvailabilityCheck,
} from '@/types/api';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * High-Definition (HDR) Product Photography Mapping for OnFresh Showcase.
 * Guarantees every snack and bakery card renders an authentic, ultra-crisp image.
 */
export const HDR_PRODUCT_IMAGES: Record<string, string> = {
  'kerala-banana-chips': '/images/hero-banana-chips.jpg',
  'kerala-nendran-banana-chips': '/images/hero-banana-chips.jpg',
  'banana-chips': '/images/hero-banana-chips.jpg',
  'masala-nendrakai-chips': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=1200&q=85',
  'spicy-pepper-banana-chips': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=1200&q=85',
  'peri-peri-banana-chips': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=1200&q=85',
  'paya-chips': 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=85',
  'sharkkara-varatti': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=85',
  'sweet-sharkkara-varatti': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=85',
  'kerala-mixture': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85',
  'special-kerala-mixture': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85',
  'special-spicy-kerala-mixture': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85',
  'mixture-savouries': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=85',
  'masala-kadala': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1200&q=85',
  'masala-chola': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=85',
  'ribbon-pakkavada': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
  'ribbon-pakavada': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
  'traditional-ribbon-murukku': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
  'thenkuzhal-murukku': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=85',
  'kai-murukku': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=85',
  'ring-murukku': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=85',
  'butter-murukku': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=85',
  'uppu-seedai': 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&q=85',
  'vella-seedai': 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&q=85',
  'thattai-vada': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
  'butter-rusk': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
  'crispy-cardamom-tea-rusk': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
  'cardamom-rusk': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
  'kerala-plum-cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85',
  'poola-chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=1200&q=85',
  'stick-poola': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=1200&q=85',
  'spicy-tapioca-chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=1200&q=85',
  'tapioca-chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=1200&q=85',
  'jackfruit-chips': 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=1200&q=85',
  'crispy-onion-pakkoda': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85',
  'bakery-butter-cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=85',
  'biscuits-cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=85',
};

export function getHdrProductImage(slug?: string, currentImage?: string | null): string {
  if (currentImage && (currentImage.startsWith('http://') || currentImage.startsWith('https://'))) {
    return currentImage;
  }
  if (!slug) {
    return 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=1200&q=85';
  }
  const cleanSlug = slug.toLowerCase();
  for (const [key, url] of Object.entries(HDR_PRODUCT_IMAGES)) {
    if (cleanSlug.includes(key) || key.includes(cleanSlug)) {
      return url;
    }
  }
  return 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=1200&q=85';
}

/**
 * Fetch system health and connectivity status from Django backend.
 */
export async function getBackendHealth(): Promise<{
  data: HealthCheckResponse | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/health/`, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      return {
        data: null,
        error: `Server responded with HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data: HealthCheckResponse = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'Failed to connect to backend server. Ensure Django dev server is running on port 8000.';
    return {
      data: null,
      error: message,
    };
  }
}

/**
 * Fetch active categories.
 */
export async function getCategories(): Promise<{
  data: Category[] | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      return { data: null, error: `Failed to fetch categories: HTTP ${res.status}` };
    }
    const json = await res.json();
    const data: Category[] = Array.isArray(json) ? json : json.results || [];
    return { data, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Error fetching categories',
    };
  }
}

/**
 * Fetch single category by slug.
 */
export async function getCategoryBySlug(slug: string): Promise<{
  data: Category | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(slug)}/`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      return { data: null, error: `Category not found: HTTP ${res.status}` };
    }
    const data: Category = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Error fetching category',
    };
  }
}

export interface ProductQueryParams {
  category?: string;
  is_featured?: boolean;
  search?: string;
  ordering?: string;
  segment?: string;
  page?: number;
}

/**
 * Fetch products with optional filtering, search, and sorting.
 */
export async function getProducts(params?: ProductQueryParams): Promise<{
  data: PaginatedResponse<Product> | null;
  error: string | null;
}> {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.segment) query.append('segment', params.segment);
    if (params?.is_featured !== undefined) {
      query.append('is_featured', String(params.is_featured));
    }
    if (params?.search) query.append('search', params.search);
    if (params?.ordering) query.append('ordering', params.ordering);
    if (params?.page) query.append('page', String(params.page));

    const url = `${API_BASE_URL}/products/${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return { data: null, error: `Failed to fetch products: HTTP ${res.status}` };
    }

    const json = await res.json();
    if (Array.isArray(json)) {
      const results = json.map((p) => ({
        ...p,
        main_image: getHdrProductImage(p.slug, p.main_image),
      }));
      return {
        data: {
          count: results.length,
          next: null,
          previous: null,
          results,
        },
        error: null,
      };
    }

    if (json && Array.isArray(json.results)) {
      json.results = json.results.map((p: Product) => ({
        ...p,
        main_image: getHdrProductImage(p.slug, p.main_image),
      }));
    }

    return { data: json, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Error fetching products',
    };
  }
}

/**
 * Fetch product details by slug.
 */
export async function getProductBySlug(slug: string): Promise<{
  data: Product | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(slug)}/`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return { data: null, error: `Product not found: HTTP ${res.status}` };
    }

    const data: Product = await res.json();
    if (data) {
      data.main_image = getHdrProductImage(data.slug, data.main_image);
    }
    return { data, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Error fetching product',
    };
  }
}

// ==========================================
// Authentication API Functions
// ==========================================

export async function apiRegister(payload: {
  full_name: string;
  email: string;
  mobile_number: string;
  customer_type?: 'individual' | 'business';
  password: string;
  password_confirmation: string;
  business_name?: string;
  business_type?: string;
  gstin?: string;
}): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      return {
        status: 'error',
        errors: json.errors || {},
        detail: json.detail || 'Registration failed. Please check form inputs.',
      };
    }
    return json;
  } catch (err: unknown) {
    return {
      status: 'error',
      detail: err instanceof Error ? err.message : 'Connection to server failed',
    };
  }
}

export async function apiLogin(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      return {
        status: 'error',
        detail: json.detail || 'Invalid email or password.',
        errors: json.errors || {},
      };
    }
    return json;
  } catch (err: unknown) {
    return {
      status: 'error',
      detail: err instanceof Error ? err.message : 'Failed to connect to authentication server',
    };
  }
}

export async function apiLogout(): Promise<{ status: string; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/logout/`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    return await res.json();
  } catch {
    return { status: 'success', message: 'Logged out' };
  }
}

export async function apiGetCurrentUser(): Promise<{
  data: User | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me/`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      return { data: null, error: `Unauthorized (${res.status})` };
    }

    const json = await res.json();
    return { data: json.user || null, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch current user',
    };
  }
}

// ==========================================
// Customer Profile & Address API Functions
// ==========================================

export async function apiGetCustomerProfile(): Promise<{
  data: CustomerProfile | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/customers/profile/`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      return { data: null, error: `Failed to fetch profile (${res.status})` };
    }

    const json = await res.json();
    return { data: json.profile || null, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Error fetching profile',
    };
  }
}

export async function apiUpdateCustomerProfile(payload: Partial<CustomerProfile> & { full_name?: string }): Promise<{
  data: CustomerProfile | null;
  error: string | null;
  errors?: Record<string, string[] | string>;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/customers/profile/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      return {
        data: null,
        error: json.detail || 'Failed to update profile',
        errors: json.errors || {},
      };
    }
    return { data: json.profile, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Network error updating profile',
    };
  }
}

export async function apiGetAddresses(): Promise<{
  data: Address[] | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/customers/addresses/`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      return { data: null, error: `Failed to fetch addresses (${res.status})` };
    }

    const json = await res.json();
    const data: Address[] = Array.isArray(json) ? json : json.results || [];
    return { data, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Error fetching addresses',
    };
  }
}

export async function apiCreateAddress(payload: Omit<Address, 'id'>): Promise<{
  data: Address | null;
  error: string | null;
  errors?: Record<string, string[] | string>;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/customers/addresses/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      return {
        data: null,
        error: json.detail || 'Failed to create address',
        errors: json || {},
      };
    }
    return { data: json, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Network error creating address',
    };
  }
}

export async function apiUpdateAddress(
  id: number,
  payload: Partial<Address>
): Promise<{
  data: Address | null;
  error: string | null;
  errors?: Record<string, string[] | string>;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/customers/addresses/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      return {
        data: null,
        error: json.detail || 'Failed to update address',
        errors: json || {},
      };
    }
    return { data: json, error: null };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Network error updating address',
    };
  }
}

export async function apiDeleteAddress(id: number): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/customers/addresses/${id}/`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });

    if (!res.ok && res.status !== 204) {
      return { success: false, error: `Failed to delete address (${res.status})` };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error deleting address',
    };
  }
}

export async function apiUpgradeToWholesale(payload: {
  business_name: string;
  business_type: string;
  phone_number: string;
  contact_person?: string;
  gstin?: string;
}): Promise<{
  status: string;
  message?: string;
  profile?: CustomerProfile;
  errors?: Record<string, string[]>;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/customers/request-wholesale/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    return json;
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Failed to submit wholesale application',
    };
  }
}

export async function apiCalculatePricing(
  items: { variant_id: number; quantity: number }[]
): Promise<PricingCalculationResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/calculate-pricing/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch {
    return null;
  }
}

// ==========================================
// Phase 5: Cart, Checkout & Orders APIs
// ==========================================

export async function apiGetCart(): Promise<{ data: Cart | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to fetch cart (${res.status})` };
    }
    const data: Cart = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Error fetching cart' };
  }
}

export async function apiAddToCart(
  variant_id: number,
  quantity: number = 1
): Promise<{ data: Cart | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/items/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ variant_id, quantity }),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      return {
        data: null,
        error: errJson?.message || `Failed to add item to cart (${res.status})`,
      };
    }
    const data: Cart = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Network error adding to cart' };
  }
}

export async function apiUpdateCartItem(
  item_id: number,
  quantity: number
): Promise<{ data: Cart | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/items/${item_id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      return {
        data: null,
        error: errJson?.message || `Failed to update cart (${res.status})`,
      };
    }
    const data: Cart = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Error updating cart item' };
  }
}

export async function apiRemoveCartItem(
  item_id: number
): Promise<{ data: Cart | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/items/${item_id}/`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to remove item (${res.status})` };
    }
    const data: Cart = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Error removing cart item' };
  }
}

export async function apiClearCart(): Promise<{ data: Cart | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/clear/`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to clear cart (${res.status})` };
    }
    const data: Cart = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Error clearing cart' };
  }
}

export async function apiSyncCart(
  items: { variant_id: number; quantity: number }[]
): Promise<{ data: Cart | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}/cart/sync/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ items }),
    });
    if (!res.ok) {
      return { data: null, error: `Failed to sync cart (${res.status})` };
    }
    const data: Cart = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Error syncing cart' };
  }
}

export async function apiCheckout(payload: CheckoutPayload): Promise<CheckoutResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/checkout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      return {
        status: 'error',
        message: json.message || 'Checkout failed. Please review your address and items.',
        errors: json.errors,
      };
    }
    return json;
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Network error during checkout.',
    };
  }
}

export async function apiGetOrders(): Promise<{
  data: OrderSummary[] | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to load orders (${res.status})` };
    }
    const json = await res.json();
    const data: OrderSummary[] = Array.isArray(json) ? json : json.results || [];
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Error loading orders' };
  }
}

export async function apiGetOrder(
  order_number: string
): Promise<{ data: OrderDetail | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(order_number)}/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Order not found (${res.status})` };
    }
    const data: OrderDetail = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Error loading order' };
  }
}

export async function apiCancelOrder(
  order_number: string,
  reason: string = 'Customer requested cancellation.'
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(order_number)}/cancel/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ reason }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: json.message || 'Failed to cancel order.' };
    }
    return { success: true, message: json.message };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiVerifyPayment(
  order_number: string,
  payload: Record<string, unknown>
): Promise<{ success: boolean; message: string; data?: unknown }> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(order_number)}/payment/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: json.message || 'Payment verification failed.' };
    }
    return { success: true, message: json.message, data: json.data };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

// ==========================================
// Phase 6: Inventory, Batches & Reports APIs
// ==========================================

export async function apiGetInventory(params?: {
  low_stock?: boolean;
  out_of_stock?: boolean;
  search?: string;
  category?: string;
}): Promise<{ data: StockItem[] | null; error: string | null }> {
  try {
    const q = new URLSearchParams();
    if (params?.low_stock) q.set('low_stock', 'true');
    if (params?.out_of_stock) q.set('out_of_stock', 'true');
    if (params?.search) q.set('search', params.search);
    if (params?.category) q.set('category', params.category);

    const qs = q.toString() ? `?${q.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/inventory/${qs}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to load inventory (${res.status})` };
    }
    const json = await res.json();
    const data: StockItem[] = Array.isArray(json) ? json : json.results || [];
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Error fetching inventory' };
  }
}

export async function apiRecordStockIn(payload: {
  variant_id: number;
  quantity: number;
  movement_type?: string;
  batch_id?: number;
  reference_number?: string;
  reason?: string;
}): Promise<{ success: boolean; message: string; stock?: StockItem }> {
  try {
    const res = await fetch(`${API_BASE_URL}/inventory/stock-in/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: json.message || 'Failed to record stock in.' };
    }
    return { success: true, message: json.message, stock: json.stock };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiAdjustStock(payload: {
  variant_id: number;
  new_quantity_on_hand: number;
  reason: string;
}): Promise<{ success: boolean; message: string; stock?: StockItem }> {
  try {
    const res = await fetch(`${API_BASE_URL}/inventory/adjust/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: json.message || 'Failed to adjust stock.' };
    }
    return { success: true, message: json.message, stock: json.stock };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetStockMovements(params?: {
  movement_type?: string;
  variant_id?: number;
  reference?: string;
}): Promise<{ data: StockMovement[] | null; error: string | null }> {
  try {
    const q = new URLSearchParams();
    if (params?.movement_type) q.set('movement_type', params.movement_type);
    if (params?.variant_id) q.set('variant_id', String(params.variant_id));
    if (params?.reference) q.set('reference', params.reference);

    const qs = q.toString() ? `?${q.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/inventory/movements/${qs}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to load stock movements (${res.status})` };
    }
    const json = await res.json();
    const data: StockMovement[] = Array.isArray(json) ? json : json.results || [];
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Error fetching movements' };
  }
}

export async function apiGetProductionBatches(params?: {
  status?: string;
  variant_id?: number;
  expiring_soon?: boolean;
  expired?: boolean;
}): Promise<{ data: ProductionBatch[] | null; error: string | null }> {
  try {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.variant_id) q.set('variant_id', String(params.variant_id));
    if (params?.expiring_soon) q.set('expiring_soon', 'true');
    if (params?.expired) q.set('expired', 'true');

    const qs = q.toString() ? `?${q.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/inventory/batches/${qs}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to load batches (${res.status})` };
    }
    const json = await res.json();
    const data: ProductionBatch[] = Array.isArray(json) ? json : json.results || [];
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Error fetching batches' };
  }
}

export async function apiCreateProductionBatch(payload: {
  variant_id: number;
  production_date: string;
  expiry_date: string;
  manufactured_quantity: number;
  manufacturing_notes?: string;
  auto_complete?: boolean;
}): Promise<{ success: boolean; message: string; batch?: ProductionBatch }> {
  try {
    const res = await fetch(`${API_BASE_URL}/inventory/batches/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: json.errors ? JSON.stringify(json.errors) : (json.message || 'Failed to create batch.') };
    }
    return { success: true, message: 'Batch created successfully', batch: json };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiCompleteProductionBatch(
  batch_number: string
): Promise<{ success: boolean; message: string; batch?: ProductionBatch }> {
  try {
    const res = await fetch(`${API_BASE_URL}/inventory/batches/${encodeURIComponent(batch_number)}/complete/`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: json.message || 'Failed to complete batch.' };
    }
    return { success: true, message: json.message, batch: json.batch };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetAdminOrders(paramsObj: {
  order_status?: string;
  payment_status?: string;
  customer_type?: string;
  search?: string;
  page?: number;
}): Promise<{ data: PaginatedResponse<OrderSummary> | null; error: string | null }> {
  try {
    const params = new URLSearchParams();
    if (paramsObj.order_status) params.set('order_status', paramsObj.order_status);
    if (paramsObj.payment_status) params.set('payment_status', paramsObj.payment_status);
    if (paramsObj.customer_type) params.set('customer_type', paramsObj.customer_type);
    if (paramsObj.search) params.set('search', paramsObj.search);
    if (paramsObj.page) params.set('page', String(paramsObj.page));

    const res = await fetch(`${API_BASE_URL}/orders/admin/orders/?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to load orders (${res.status})` };
    }
    const data: PaginatedResponse<OrderSummary> = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiUpdateOrderStatus(
  orderNumber: string,
  payload: {
    order_status?: string;
    payment_status?: string;
    admin_notes?: string;
  }
): Promise<{ success: boolean; order?: OrderDetail; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/admin/orders/${encodeURIComponent(orderNumber)}/status/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: json.errors ? JSON.stringify(json.errors) : (json.message || 'Status update failed.') };
    }
    return { success: true, order: json.order, message: json.message };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetExpiryReport(
  warning_days: number = 30
): Promise<{ data: ExpiryReport | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}/inventory/expiry/?warning_days=${warning_days}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to load expiry report (${res.status})` };
    }
    const data: ExpiryReport = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Error fetching expiry report' };
  }
}

export async function apiGetInventoryReportSummary(): Promise<{
  data: InventorySummary | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/inventory/reports/summary/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to load inventory summary (${res.status})` };
    }
    const data: InventorySummary = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Error fetching summary' };
  }
}

// ==========================================
// Phase 7: Admin Dashboard, Analytics, Invoices & Staff APIs
// ==========================================

export async function apiGetDashboardSummary(
  period: string = 'this_month',
  startDate?: string,
  endDate?: string
): Promise<{ data: DashboardSummary | null; error: string | null }> {
  try {
    const params = new URLSearchParams({ period });
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);

    const res = await fetch(`${API_BASE_URL}/analytics/dashboard/?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to load dashboard metrics (${res.status})` };
    }
    const json = await res.json();
    return { data: json.data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetSalesAnalytics(
  period: string = '30days',
  interval: string = 'daily',
  startDate?: string,
  endDate?: string
): Promise<{ data: SalesAnalyticsData | null; error: string | null }> {
  try {
    const params = new URLSearchParams({ period, interval });
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);

    const res = await fetch(`${API_BASE_URL}/analytics/sales/?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to load sales analytics (${res.status})` };
    }
    const json = await res.json();
    return { data: json.data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetB2BvsB2CComparison(
  period: string = 'this_month',
  startDate?: string,
  endDate?: string
): Promise<{ data: B2BvsB2CComparisonData | null; error: string | null }> {
  try {
    const params = new URLSearchParams({ period });
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);

    const res = await fetch(`${API_BASE_URL}/analytics/b2b-b2c/?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to load B2B/B2C comparison (${res.status})` };
    }
    const json = await res.json();
    return { data: json.data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetProductAnalytics(
  period: string = 'this_month',
  categoryId?: number,
  startDate?: string,
  endDate?: string
): Promise<{ data: ProductAnalyticsData | null; error: string | null }> {
  try {
    const params = new URLSearchParams({ period });
    if (categoryId) params.set('category_id', String(categoryId));
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);

    const res = await fetch(`${API_BASE_URL}/analytics/products/?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to load product analytics (${res.status})` };
    }
    const json = await res.json();
    return { data: json.data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetAdminCustomers(paramsObj: {
  customer_type?: string;
  wholesale_status?: string;
  is_active?: string;
  search?: string;
  page?: number;
}): Promise<{ data: PaginatedResponse<AdminCustomer> | null; error: string | null }> {
  try {
    const params = new URLSearchParams();
    if (paramsObj.customer_type) params.set('customer_type', paramsObj.customer_type);
    if (paramsObj.wholesale_status) params.set('wholesale_status', paramsObj.wholesale_status);
    if (paramsObj.is_active !== undefined && paramsObj.is_active !== '') params.set('is_active', paramsObj.is_active);
    if (paramsObj.search) params.set('search', paramsObj.search);
    if (paramsObj.page) params.set('page', String(paramsObj.page));

    const res = await fetch(`${API_BASE_URL}/customers/admin/customers/?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to load customers (${res.status})` };
    }
    const data: PaginatedResponse<AdminCustomer> = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetAdminCustomerDetail(
  id: number
): Promise<{ customer: AdminCustomer | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}/customers/admin/customers/${id}/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { customer: null, error: `Failed to load customer details (${res.status})` };
    }
    const json = await res.json();
    return { customer: json.customer, error: null };
  } catch (err: unknown) {
    return { customer: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiToggleCustomerActive(
  id: number,
  is_active?: boolean
): Promise<{ success: boolean; is_active?: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/customers/admin/customers/${id}/status/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(is_active !== undefined ? { is_active } : {}),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: json.detail || 'Failed to update customer status.' };
    }
    return { success: true, is_active: json.is_active, message: json.message };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiAdminWholesaleDecision(
  profileId: number,
  action: 'approve' | 'reject',
  reason?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/customers/admin/applications/${profileId}/decision/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ action, reason }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: json.detail || 'Failed to submit decision.' };
    }
    return { success: true, message: json.message };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export const apiGetOrderDetail = apiGetOrder;

export async function apiGetAdminInvoices(paramsObj: {
  status?: string;
  payment_status?: string;
  customer_type?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
}): Promise<{ data: PaginatedResponse<Invoice> | null; error: string | null }> {
  try {
    const params = new URLSearchParams();
    if (paramsObj.status) params.set('status', paramsObj.status);
    if (paramsObj.payment_status) params.set('payment_status', paramsObj.payment_status);
    if (paramsObj.customer_type) params.set('customer_type', paramsObj.customer_type);
    if (paramsObj.search) params.set('search', paramsObj.search);
    if (paramsObj.date_from) params.set('date_from', paramsObj.date_from);
    if (paramsObj.date_to) params.set('date_to', paramsObj.date_to);
    if (paramsObj.page) params.set('page', String(paramsObj.page));

    const res = await fetch(`${API_BASE_URL}/orders/admin/invoices/?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to load invoices (${res.status})` };
    }
    const data: PaginatedResponse<Invoice> = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetAdminInvoiceDetail(
  invoiceNumber: string
): Promise<{ invoice: Invoice | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/admin/invoices/${invoiceNumber}/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { invoice: null, error: `Failed to load invoice (${res.status})` };
    }
    const json = await res.json();
    return { invoice: json.invoice, error: null };
  } catch (err: unknown) {
    return { invoice: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetOrderInvoice(
  orderNumber: string
): Promise<{ invoice: Invoice | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderNumber}/invoice/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { invoice: null, error: `Failed to load invoice for order (${res.status})` };
    }
    const json = await res.json();
    return { invoice: json.invoice, error: null };
  } catch (err: unknown) {
    return { invoice: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetAdminStaff(): Promise<{ staff: StaffMember[]; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/admin/staff/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { staff: [], error: `Failed to load staff list (${res.status})` };
    }
    const json = await res.json();
    return { staff: json.staff || [], error: null };
  } catch (err: unknown) {
    return { staff: [], error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiCreateStaffMember(payload: {
  email: string;
  full_name: string;
  password?: string;
  roles: string[];
}): Promise<{ success: boolean; staff?: StaffMember; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/admin/staff/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: json.detail || json.message || 'Failed to create staff member.' };
    }
    return { success: true, staff: json.staff, message: json.message };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiUpdateStaffMember(
  id: number,
  payload: {
    full_name?: string;
    is_active?: boolean;
    password?: string;
    roles?: string[];
  }
): Promise<{ success: boolean; staff?: StaffMember; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/admin/staff/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: json.detail || json.message || 'Failed to update staff member.' };
    }
    return { success: true, staff: json.staff, message: json.message };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetStaffRoles(): Promise<{ roles: StaffRole[]; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/admin/roles/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { roles: [], error: `Failed to load staff roles (${res.status})` };
    }
    const json = await res.json();
    return { roles: json.roles || [], error: null };
  } catch (err: unknown) {
    return { roles: [], error: err instanceof Error ? err.message : 'Network error' };
  }
}

export function getInvoicePDFUrl(invoiceNumber: string): string {
  return `${API_BASE_URL}/orders/admin/invoices/${encodeURIComponent(invoiceNumber)}/pdf/`;
}

export function getOrderInvoicePDFUrl(orderNumber: string): string {
  return `${API_BASE_URL}/orders/${encodeURIComponent(orderNumber)}/invoice/pdf/`;
}

export function getReportExportUrl(
  type: string,
  format: 'csv' | 'excel' = 'csv',
  period: string = 'this_month',
  startDate?: string,
  endDate?: string
): string {
  const params = new URLSearchParams({ type, format, period });
  if (startDate) params.set('start_date', startDate);
  if (endDate) params.set('end_date', endDate);
  return `${API_BASE_URL}/analytics/export/?${params.toString()}`;
}

// ==========================================
// Phase 8: Manufacturing & Production APIs
// ==========================================

export async function apiGetManufacturingDashboard(): Promise<{
  data: ManufacturingDashboardData | null;
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/dashboard/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: null, error: `Failed to load manufacturing dashboard (${res.status})` };
    }
    const data: ManufacturingDashboardData = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetRawMaterials(paramsObj?: {
  category?: string;
  unit?: string;
  low_stock?: boolean;
  out_of_stock?: boolean;
  search?: string;
}): Promise<{ data: RawMaterial[]; error: string | null }> {
  try {
    const params = new URLSearchParams();
    if (paramsObj?.category) params.set('category', paramsObj.category);
    if (paramsObj?.unit) params.set('unit', paramsObj.unit);
    if (paramsObj?.low_stock) params.set('low_stock', 'true');
    if (paramsObj?.out_of_stock) params.set('out_of_stock', 'true');
    if (paramsObj?.search) params.set('search', paramsObj.search);

    const res = await fetch(`${API_BASE_URL}/manufacturing/raw-materials/?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      return { data: [], error: `Failed to load raw materials (${res.status})` };
    }
    const json = await res.json();
    return { data: json.results || json, error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetRawMaterialCategories(): Promise<{
  data: RawMaterialCategory[];
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/categories/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) return { data: [], error: `Failed to load categories (${res.status})` };
    const json = await res.json();
    return { data: json.results || json, error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiCreateRawMaterial(payload: {
  material_code: string;
  name: string;
  category: number;
  unit_of_measure: string;
  current_stock: string | number;
  minimum_stock_level: string | number;
  reorder_quantity: string | number;
  unit_cost: string | number;
  storage_location?: string;
  notes?: string;
}): Promise<{ success: boolean; data?: RawMaterial; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/raw-materials/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: JSON.stringify(json) };
    }
    return { success: true, data: json };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiAdjustRawMaterialStock(
  materialId: number,
  payload: { new_quantity: number | string; notes?: string }
): Promise<{ success: boolean; data?: RawMaterial; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/raw-materials/${materialId}/adjust_stock/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.error || 'Stock adjustment failed' };
    return { success: true, data: json };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetRawMaterialMovements(paramsObj?: {
  material_id?: number;
  movement_type?: string;
}): Promise<{ data: RawMaterialMovement[]; error: string | null }> {
  try {
    const params = new URLSearchParams();
    if (paramsObj?.material_id) params.set('material_id', String(paramsObj.material_id));
    if (paramsObj?.movement_type) params.set('movement_type', paramsObj.movement_type);

    const res = await fetch(`${API_BASE_URL}/manufacturing/movements/?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) return { data: [], error: `Failed to load movements (${res.status})` };
    const json = await res.json();
    return { data: json.results || json, error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetSuppliers(search?: string): Promise<{
  data: Supplier[];
  error: string | null;
}> {
  try {
    const params = new URLSearchParams();
    if (search) params.set('search', search);

    const res = await fetch(`${API_BASE_URL}/manufacturing/suppliers/?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) return { data: [], error: `Failed to load suppliers (${res.status})` };
    const json = await res.json();
    return { data: json.results || json, error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiCreateSupplier(payload: {
  supplier_code: string;
  name: string;
  contact_person?: string;
  phone: string;
  email?: string;
  address_line1: string;
  city?: string;
  state?: string;
  postal_code?: string;
  gstin?: string;
  payment_terms?: string;
  lead_time_days?: number;
  notes?: string;
}): Promise<{ success: boolean; data?: Supplier; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/suppliers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: JSON.stringify(json) };
    return { success: true, data: json };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiAssignSupplierMaterial(
  supplierId: number,
  payload: {
    material_id: number;
    quoted_price: number | string;
    minimum_order_qty?: number | string;
    supplier_material_code?: string;
    is_preferred?: boolean;
  }
): Promise<{ success: boolean; data?: SupplierMaterial; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/suppliers/${supplierId}/assign_material/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.error || 'Assignment failed' };
    return { success: true, data: json };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetPurchaseOrders(paramsObj?: {
  status?: string;
  supplier?: number;
  search?: string;
}): Promise<{ data: PurchaseOrder[]; error: string | null }> {
  try {
    const params = new URLSearchParams();
    if (paramsObj?.status) params.set('status', paramsObj.status);
    if (paramsObj?.supplier) params.set('supplier', String(paramsObj.supplier));
    if (paramsObj?.search) params.set('search', paramsObj.search);

    const res = await fetch(`${API_BASE_URL}/manufacturing/purchases/?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) return { data: [], error: `Failed to load POs (${res.status})` };
    const json = await res.json();
    return { data: json.results || json, error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiCreatePurchaseOrder(payload: {
  supplier: number;
  order_date: string;
  expected_delivery_date?: string;
  vendor_invoice_number?: string;
  notes?: string;
  items: Array<{
    material_id: number;
    ordered_quantity: number | string;
    unit_cost: number | string;
    tax_rate?: number | string;
  }>;
}): Promise<{ success: boolean; data?: PurchaseOrder; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/purchases/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: JSON.stringify(json) };
    return { success: true, data: json };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiReceivePurchaseOrder(
  poId: number,
  payload?: {
    vendor_invoice_number?: string;
    items?: Array<{ id: number; received_quantity: number | string }>;
  }
): Promise<{ success: boolean; data?: PurchaseOrder; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/purchases/${poId}/receive/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload || {}),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.error || 'Receipt failed' };
    return { success: true, data: json };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiRecordSupplierPayment(
  poId: number,
  payload: {
    amount: number | string;
    payment_method: string;
    reference_number?: string;
    notes?: string;
  }
): Promise<{ success: boolean; data?: SupplierPayment; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/purchases/${poId}/record_payment/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.error || 'Payment record failed' };
    return { success: true, data: json };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetRecipes(paramsObj?: {
  product?: number;
  is_active?: boolean;
  search?: string;
}): Promise<{ data: Recipe[]; error: string | null }> {
  try {
    const params = new URLSearchParams();
    if (paramsObj?.product) params.set('product', String(paramsObj.product));
    if (paramsObj?.is_active !== undefined) params.set('is_active', String(paramsObj.is_active));
    if (paramsObj?.search) params.set('search', paramsObj.search);

    const res = await fetch(`${API_BASE_URL}/manufacturing/recipes/?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) return { data: [], error: `Failed to load recipes (${res.status})` };
    const json = await res.json();
    return { data: json.results || json, error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiCreateRecipe(payload: {
  product: number;
  variant?: number | null;
  recipe_code: string;
  name: string;
  version?: number;
  batch_output_quantity: number | string;
  output_unit: string;
  target_variant_units: number;
  estimated_labor_cost?: number | string;
  estimated_overhead_cost?: number | string;
  instructions?: string;
  notes?: string;
  ingredients: Array<{
    material_id: number;
    quantity: number | string;
    unit: string;
    wastage_percentage?: number | string;
  }>;
  packaging_materials: Array<{
    packaging_material_id: number;
    quantity: number | string;
    unit?: string;
    notes?: string;
  }>;
}): Promise<{ success: boolean; data?: Recipe; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/recipes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: JSON.stringify(json) };
    return { success: true, data: json };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiCheckRecipeAvailability(
  recipeId: number,
  targetUnits: number
): Promise<{ data: IngredientAvailabilityCheck | null; error: string | null }> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/manufacturing/recipes/${recipeId}/check_availability/?target_units=${targetUnits}`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'include',
      }
    );
    if (!res.ok) return { data: null, error: `Availability check failed (${res.status})` };
    const data: IngredientAvailabilityCheck = await res.json();
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetProductionOrders(paramsObj?: {
  status?: string;
  search?: string;
}): Promise<{ data: ProductionOrder[]; error: string | null }> {
  try {
    const params = new URLSearchParams();
    if (paramsObj?.status) params.set('status', paramsObj.status);
    if (paramsObj?.search) params.set('search', paramsObj.search);

    const res = await fetch(`${API_BASE_URL}/manufacturing/production-orders/?${params.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) return { data: [], error: `Failed to load production orders (${res.status})` };
    const json = await res.json();
    return { data: json.results || json, error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiCreateProductionOrder(payload: {
  recipe: number;
  planned_quantity: number;
  start_date?: string;
  notes?: string;
}): Promise<{ success: boolean; data?: ProductionOrder; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/production-orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.error || JSON.stringify(json) };
    return { success: true, data: json };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiApproveProductionOrder(
  id: number
): Promise<{ success: boolean; data?: ProductionOrder; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/production-orders/${id}/approve/`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.error || 'Approval failed' };
    return { success: true, data: json };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiStartProductionOrder(
  id: number
): Promise<{ success: boolean; data?: ProductionOrder; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/production-orders/${id}/start/`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.error || 'Failed to start production' };
    return { success: true, data: json };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiExecuteProductionRun(
  id: number,
  payload: {
    produced_quantity: number;
    rejected_quantity?: number;
    actual_consumptions?: Array<{ id: number; actual_quantity: number | string; wastage_quantity?: number | string }>;
    actual_packagings?: Array<{ id: number; actual_quantity: number | string; wastage_quantity?: number | string }>;
    expiry_date?: string;
  }
): Promise<{ success: boolean; data?: ProductionOrder; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/production-orders/${id}/execute_run/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.error || 'Execution failed' };
    return { success: true, data: json };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiGetQualityInspections(): Promise<{
  data: QualityInspection[];
  error: string | null;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/quality-inspections/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) return { data: [], error: `Failed to load QC inspections (${res.status})` };
    const json = await res.json();
    return { data: json.results || json, error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Network error' };
  }
}

export async function apiInspectQuality(payload: {
  production_order: number;
  sample_size?: number;
  appearance_status?: 'pass' | 'marginal' | 'fail';
  taste_crispness_status?: 'pass' | 'marginal' | 'fail';
  moisture_status?: 'pass' | 'fail';
  packaging_seal_status?: 'pass' | 'fail';
  label_batch_verification?: 'pass' | 'fail';
  overall_result: 'passed' | 'failed' | 'quarantined';
  defect_notes?: string;
  corrective_actions?: string;
}): Promise<{ success: boolean; data?: QualityInspection; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/manufacturing/quality-inspections/inspect/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.error || 'Inspection submission failed' };
    return { success: true, data: json };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : 'Network error' };
  }
}


export { API_BASE_URL };
