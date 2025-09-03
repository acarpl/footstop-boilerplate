import apiClient from "../apiClient";

// === TYPE DEFINITIONS ===

export interface Image {
  id_gambar: number;
  url: string;
}

export interface Brand {
  id_brand: number;
  brand_name: string;
  description?: string;
  logo_url?: string;
  created_at?: string;
}

export interface Category {
  id_category: number;
  category_name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
}

export interface Product {
  id_product: number;
  product_name: string;
  description?: string;
  price: string;
  size: string;
  stock?: number;
  rating: number;
  rating_count?: number;
  discount_percentage?: number;
  is_featured?: boolean;
  is_active?: boolean;
  weight?: number;
  dimensions?: string;
  material?: string;
  created_at: string | number | Date;
  updated_at?: string | number | Date;
  brand: Brand;
  category: Category;
  images: Image[];
}

// Product filters interface for better type safety
export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  id_category?: number | null;
  id_brand?: number | null;
  min_price?: number;
  max_price?: number;
  sort_by?: "name" | "price" | "rating" | "created_at" | "popularity";
  sort_order?: "asc" | "desc";
  is_featured?: boolean;
  in_stock?: boolean;
  rating_min?: number;
}

// Response interface for paginated products
export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Product creation/update interfaces
export interface CreateProductPayload {
  product_name: string;
  description?: string;
  price: string;
  size: string;
  stock?: number;
  id_brand: number;
  id_category: number;
  weight?: number;
  dimensions?: string;
  material?: string;
  images: string[]; // Array of image URLs
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  id_product: number;
  is_featured?: boolean;
  is_active?: boolean;
}

// Product review interfaces
export interface ProductReview {
  id_review: number;
  rating: number;
  comment: string;
  user_name: string;
  created_at: string;
  images?: Image[];
}

export interface ProductWithReviews extends Product {
  reviews: ProductReview[];
  average_rating: number;
  total_reviews: number;
}

// === CORE PRODUCT FUNCTIONS ===

/**
 * Mengambil daftar produk dari backend dengan filter dan paginasi.
 * @param filters - Objek berisi filter params
 * @returns Promise yang resolve dengan objek berisi data produk dan info paginasi.
 */
export const getProducts = async (
  filters: ProductFilters = {}
): Promise<ProductsResponse> => {
  try {
    const response = await apiClient.get("/products", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to fetch products.", error);
    throw error;
  }
};

/**
 * Mengambil semua kategori.
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to fetch categories.", error);
    throw error;
  }
};

/**
 * Mengambil semua merek.
 */
export const getBrands = async (): Promise<Brand[]> => {
  try {
    const response = await apiClient.get("/brands");
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to fetch brands.", error);
    throw error;
  }
};

/**
 * Mengambil detail produk berdasarkan ID
 */
export const getProductById = async (
  productId: number | string
): Promise<Product> => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Service Error: Failed to fetch product with ID ${productId}.`,
      error
    );
    throw error;
  }
};

/**
 * Mengambil produk dengan reviews
 */
export const getProductWithReviews = async (
  productId: number | string
): Promise<ProductWithReviews> => {
  try {
    const response = await apiClient.get(`/products/${productId}/reviews`);
    return response.data;
  } catch (error) {
    console.error(
      `Service Error: Failed to fetch product reviews for ID ${productId}.`,
      error
    );
    throw error;
  }
};

// === SEARCH & FILTER FUNCTIONS ===

/**
 * Search produk dengan query string
 */
export const searchProducts = async (
  query: string,
  filters: Omit<ProductFilters, "search"> = {}
): Promise<ProductsResponse> => {
  try {
    const searchFilters = { ...filters, search: query };
    return await getProducts(searchFilters);
  } catch (error) {
    console.error("Service Error: Failed to search products.", error);
    throw error;
  }
};

/**
 * Mengambil produk berdasarkan kategori
 */
export const getProductsByCategory = async (
  categoryId: number,
  filters: Omit<ProductFilters, "id_category"> = {}
): Promise<ProductsResponse> => {
  try {
    const categoryFilters = { ...filters, id_category: categoryId };
    return await getProducts(categoryFilters);
  } catch (error) {
    console.error(
      "Service Error: Failed to fetch products by category.",
      error
    );
    throw error;
  }
};

/**
 * Mengambil produk berdasarkan brand
 */
export const getProductsByBrand = async (
  brandId: number,
  filters: Omit<ProductFilters, "id_brand"> = {}
): Promise<ProductsResponse> => {
  try {
    const brandFilters = { ...filters, id_brand: brandId };
    return await getProducts(brandFilters);
  } catch (error) {
    console.error("Service Error: Failed to fetch products by brand.", error);
    throw error;
  }
};

export const getFeaturedProducts = async (
  limit: number = 10
): Promise<Product[]> => {
  try {
    const response = await getProducts({
      is_featured: true,
      limit,
      sort_by: "rating",
      sort_order: "desc",
    });
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to fetch featured products.", error);
    throw error;
  }
};

/**
 * Mengambil produk terbaru
 */
export const getLatestProducts = async (
  limit: number = 10
): Promise<Product[]> => {
  try {
    const response = await getProducts({
      limit,
      sort_by: "created_at",
      sort_order: "desc",
    });
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to fetch latest products.", error);
    throw error;
  }
};

/**
 * Mengambil produk terpopuler
 */
export const getPopularProducts = async (
  limit: number = 10
): Promise<Product[]> => {
  try {
    const response = await getProducts({
      limit,
      sort_by: "popularity",
      sort_order: "desc",
      rating_min: 4,
    });
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to fetch popular products.", error);
    throw error;
  }
};

/**
 * Mengambil produk dengan diskon
 */
export const getDiscountedProducts = async (
  limit: number = 10
): Promise<Product[]> => {
  try {
    // This assumes backend filters products with discount_percentage > 0
    const response = await apiClient.get("/products/discounted", {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to fetch discounted products.", error);
    throw error;
  }
};

/**
 * Mengambil produk serupa/related
 */
export const getRelatedProducts = async (
  productId: number | string,
  limit: number = 8
): Promise<Product[]> => {
  try {
    const response = await apiClient.get(`/products/${productId}/related`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to fetch related products.", error);
    throw error;
  }
};

// === ADMIN FUNCTIONS (CREATE, UPDATE, DELETE) ===

/**
 * [ADMIN] Membuat produk baru
 */
export const createProduct = async (
  productData: CreateProductPayload
): Promise<Product> => {
  try {
    const response = await apiClient.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to create product.", error);
    throw error;
  }
};

/**
 * [ADMIN] Update produk
 */
export const updateProduct = async (
  productData: UpdateProductPayload
): Promise<Product> => {
  try {
    const { id_product, ...updateData } = productData;
    const response = await apiClient.put(`/products/${id_product}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to update product.", error);
    throw error;
  }
};

/**
 * [ADMIN] Hapus produk
 */
export const deleteProduct = async (
  productId: number | string
): Promise<void> => {
  try {
    await apiClient.delete(`/products/${productId}`);
  } catch (error) {
    console.error("Service Error: Failed to delete product.", error);
    throw error;
  }
};

/**
 * [ADMIN] Toggle featured status
 */
export const toggleFeaturedProduct = async (
  productId: number | string,
  isFeatured: boolean
): Promise<Product> => {
  try {
    const response = await apiClient.patch(`/products/${productId}/featured`, {
      is_featured: isFeatured,
    });
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to toggle featured status.", error);
    throw error;
  }
};

/**
 * [ADMIN] Update stock
 */
export const updateProductStock = async (
  productId: number | string,
  stock: number
): Promise<Product> => {
  try {
    const response = await apiClient.patch(`/products/${productId}/stock`, {
      stock,
    });
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to update product stock.", error);
    throw error;
  }
};

// === UTILITY FUNCTIONS ===

/**
 * Format harga produk
 */
export const formatProductPrice = (price: string | number): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return `Rp ${numPrice.toLocaleString("id-ID")}`;
};

/**
 * Hitung harga setelah diskon
 */
export const calculateDiscountedPrice = (
  price: string | number,
  discountPercentage: number = 0
): {
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  formattedOriginal: string;
  formattedDiscounted: string;
  formattedSavings: string;
} => {
  const originalPrice = typeof price === "string" ? parseFloat(price) : price;
  const discountedPrice = originalPrice * (1 - discountPercentage / 100);
  const savings = originalPrice - discountedPrice;

  return {
    originalPrice,
    discountedPrice,
    savings,
    formattedOriginal: formatProductPrice(originalPrice),
    formattedDiscounted: formatProductPrice(discountedPrice),
    formattedSavings: formatProductPrice(savings),
  };
};

/**
 * Get rating display info
 */
export const getRatingInfo = (rating: number, ratingCount: number = 0) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return {
    fullStars,
    hasHalfStar,
    emptyStars,
    ratingText: `${rating.toFixed(1)} (${ratingCount} ulasan)`,
    ratingLabel:
      rating >= 4.5
        ? "Sangat Baik"
        : rating >= 4.0
        ? "Baik"
        : rating >= 3.5
        ? "Cukup Baik"
        : rating >= 3.0
        ? "Biasa"
        : "Kurang Baik",
  };
};

/**
 * Check if product is in stock
 */
export const isProductInStock = (product: Product): boolean => {
  return (product.stock ?? 0) > 0;
};

/**
 * Check if product is new (created within last 30 days)
 */
export const isNewProduct = (product: Product): boolean => {
  const createdDate = new Date(product.created_at);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return createdDate > thirtyDaysAgo;
};

/**
 * Get product availability status
 */
export const getProductAvailability = (
  product: Product
): {
  status: "in_stock" | "low_stock" | "out_of_stock";
  message: string;
  color: string;
} => {
  const stock = product.stock ?? 0;

  if (stock === 0) {
    return {
      status: "out_of_stock",
      message: "Stok Habis",
      color: "red",
    };
  } else if (stock <= 5) {
    return {
      status: "low_stock",
      message: `Stok Tinggal ${stock}`,
      color: "orange",
    };
  } else {
    return {
      status: "in_stock",
      message: "Tersedia",
      color: "green",
    };
  }
};

/**
 * Get product image URL with fallback
 */
export const getProductImageUrl = (
  product: Product,
  index: number = 0
): string => {
  if (product.images && product.images.length > index) {
    return product.images[index].url;
  }
  return "/images/placeholder-product.jpg";
};

/**
 * Generate product URL slug
 */
export const generateProductSlug = (
  productName: string,
  productId: number
): string => {
  const slug = productName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .trim();
  return `${slug}-${productId}`;
};

/**
 * Validate product data
 */
export const validateProductData = (
  product: CreateProductPayload
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!product.product_name || product.product_name.trim().length < 3) {
    errors.push("Nama produk harus diisi minimal 3 karakter");
  }

  if (!product.price || parseFloat(product.price) <= 0) {
    errors.push("Harga harus lebih besar dari 0");
  }

  if (!product.size || product.size.trim().length === 0) {
    errors.push("Ukuran harus diisi");
  }

  if (!product.id_brand || product.id_brand <= 0) {
    errors.push("Brand harus dipilih");
  }

  if (!product.id_category || product.id_category <= 0) {
    errors.push("Kategori harus dipilih");
  }

  if (!product.images || product.images.length === 0) {
    errors.push("Minimal 1 gambar produk harus diupload");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sort products by various criteria
 */
export const sortProducts = (
  products: Product[],
  sortBy: ProductFilters["sort_by"] = "name",
  sortOrder: ProductFilters["sort_order"] = "asc"
): Product[] => {
  return [...products].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.product_name.localeCompare(b.product_name);
        break;
      case "price":
        comparison = parseFloat(a.price) - parseFloat(b.price);
        break;
      case "rating":
        comparison = a.rating - b.rating;
        break;
      case "created_at":
        comparison =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      default:
        comparison = 0;
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });
};

/**
 * Filter products by price range
 */
export const filterProductsByPrice = (
  products: Product[],
  minPrice?: number,
  maxPrice?: number
): Product[] => {
  return products.filter((product) => {
    const price = parseFloat(product.price);
    if (minPrice !== undefined && price < minPrice) return false;
    if (maxPrice !== undefined && price > maxPrice) return false;
    return true;
  });
};

/**
 * Get price range from products
 */
export const getProductsPriceRange = (
  products: Product[]
): {
  min: number;
  max: number;
  average: number;
} => {
  if (products.length === 0) {
    return { min: 0, max: 0, average: 0 };
  }

  const prices = products.map((p) => parseFloat(p.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  return { min, max, average };
};
