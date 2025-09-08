"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, Empty, Spin, message } from "antd";
import Image from "next/image";

// Import service and types
import { getBrands, type Brand } from "../../../../lib/services/productService";

export default function BrandPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const fetchedBrands = await getBrands();
        setBrands(Array.isArray(fetchedBrands) ? fetchedBrands : []);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        message.error("Could not load brands. Please try again.");
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      fetchBrands();
    }
  }, [mounted]);

  // Generate logo URL from open source APIs
  const generateLogoUrl = useCallback((brand_name: string): string => {
    if (!brand_name) return "/placeholder-brand.png";

    // Clean brand name for URL
    const cleanName = brand_name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Use Clearbit as primary
    return `https://logo.clearbit.com/${cleanName}.com`;
  }, []);

  // Fallback logo generation
  const generateFallbackLogo = useCallback((brand_name: string): string => {
    if (!brand_name) return "/placeholder-brand.png";

    const initials = brand_name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);

    return `https://via.placeholder.com/120x80/f0f0f0/333333?text=${encodeURIComponent(
      initials
    )}`;
  }, []);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>, brand_name: string) => {
      const target = e.target as HTMLImageElement;

      if (!target.dataset.fallbackAttempt) {
        // First fallback: try logo.dev
        const cleanName = brand_name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        target.src = `https://img.logo.dev/${cleanName}.com?token=pk_X-1ZO13GSgeOaIkJOLyTRQ`;
        target.dataset.fallbackAttempt = "1";
      } else if (target.dataset.fallbackAttempt === "1") {
        // Second fallback: try brandfetch
        const cleanName = brand_name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        target.src = `https://logo.brandfetch.io/${cleanName}.com`;
        target.dataset.fallbackAttempt = "2";
      } else {
        // Final fallback: placeholder
        target.src = generateFallbackLogo(brand_name);
        target.dataset.fallbackAttempt = "final";
      }
    },
    [generateFallbackLogo]
  );

  const handleBrandClick = useCallback((brand: Brand) => {
    message.info(`Viewing products from ${brand.brand_name}`);
    // Add navigation logic here if needed
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="container mx-auto p-6 mt-20 min-h-screen">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Brands</h1>
        <p className="text-gray-600">
          Discover all the amazing brands we work with
        </p>
      </div>

      {/* Brand Grid */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <Spin size="large" />
          <span className="ml-4 text-gray-600 mt-4">Loading brands...</span>
        </div>
      ) : brands.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Card className="w-full max-w-md">
            <Empty
              description={
                <span className="text-gray-500">
                  No brands available at the moment
                </span>
              }
            />
          </Card>
        </div>
      ) : (
        <>
          {/* Brand Count */}
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Showing {brands.length} brand{brands.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Brand Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {brands.map((brand, index) => (
              <div
                key={`brand-${brand.id_brand}-${index}`}
                className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                  opacity: 0,
                }}
              >
                <Card
                  hoverable
                  className="h-full cursor-pointer border-2 hover:border-blue-300 transition-colors duration-300"
                  onClick={() => handleBrandClick(brand)}
                  bodyStyle={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: "180px",
                  }}
                >
                  {/* Brand Logo */}
                  <div className="w-full h-20 flex items-center justify-center mb-4">
                    <Image
                      src={brand.logo || generateLogoUrl(brand.brand_name)}
                      alt={`${brand.brand_name || "Brand"} logo`}
                      width={120}
                      height={80}
                      className="object-contain max-w-full max-h-full transition-opacity duration-200"
                      style={{ width: "auto", height: "auto" }}
                      onError={(e) => handleImageError(e, brand.brand_name)}
                      loading="lazy"
                      unoptimized // Prevent Next.js optimization issues with external APIs
                    />
                  </div>

                  {/* Brand Name */}
                  <div className="text-center w-full">
                    <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 break-words">
                      {brand.brand_name || "Unknown Brand"}
                    </h3>

                    {/* Categories (if available) */}
                    {brand.categories && brand.categories.length > 0 && (
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {brand.categories
                          .slice(0, 2)
                          .map((c) => c.category_name)
                          .join(", ")}
                        {brand.categories.length > 2 && "..."}
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .break-words {
          word-wrap: break-word;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}
