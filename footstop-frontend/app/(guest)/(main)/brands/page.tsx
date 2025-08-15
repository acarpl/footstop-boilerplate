"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Checkbox, Select } from "antd";

interface Category {
  id_category: number;
  category_name: string;
}

interface Brand {
  id_brand: number;
  brand_name: string;
  logo: string; // url logo
}

export default function BrandPage() {
  const [showBrands, setShowBrands] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Simulasi fetch data
  useEffect(() => {
    setCategories([
      { id_category: 1, category_name: "Shoes" },
      { id_category: 2, category_name: "Sandals" },
      { id_category: 3, category_name: "Running" },
    ]);

    setBrands([
      { id_brand: 1, brand_name: "Adidas", logo: "/brands/adidas.png" },
      { id_brand: 2, brand_name: "Converse", logo: "/brands/converse.png" },
      { id_brand: 3, brand_name: "Crocs", logo: "/brands/crocs.png" },
      { id_brand: 4, brand_name: "Nike", logo: "/brands/nike.png" },
    ]);

    // Delay animasi
    const timer = setTimeout(() => {
      setShowBrands(true);
    }, 1500); // 1.5 detik

    return () => clearTimeout(timer);
  }, []);

  const handleCategoryChange = (id: number, checked: boolean) => {
    console.log(`Category ${id} ${checked ? "selected" : "unselected"}`);
  };

  const handleBrandChange = (value: number) => {
    console.log(`Brand selected: ${value}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 mt-20">
      {/* Sidebar Categories */}
      <aside className="bg-white rounded-lg shadow p-4 md:h-fit md:col-span-1 w-full md:sticky md:top-4">
        <div className="md:block border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Categories</h2>
          <ul className="space-y-2 text-sm">
            {categories.map((cat) => (
              <li key={cat.id_category} className="flex items-center space-x-2">
                <Checkbox
                  onChange={(e) =>
                    handleCategoryChange(cat.id_category, e.target.checked)
                  }
                >
                  {cat.category_name}
                </Checkbox>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="text-sm font-medium">Brands</label>
          <Select
            className="w-full mt-1"
            placeholder="Select Brand"
            onChange={handleBrandChange}
            options={brands.map((brand) => ({
              label: brand.brand_name,
              value: brand.id_brand,
            }))}
            allowClear
          />
        </div>
      </aside>

      {/* Brand Grid */}
      <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        {brands.map((brand, index) => (
          <motion.div
            key={brand.id_brand}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={
              showBrands
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.5 }
            }
            transition={{
              delay: 0.2 * index,
              type: "spring",
              stiffness: 120,
            }}
            className="bg-red-800 rounded-xl flex items-center justify-center h-40 cursor-pointer"
          >
            <img src={brand.logo} alt={brand.brand_name} className="h-12" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
