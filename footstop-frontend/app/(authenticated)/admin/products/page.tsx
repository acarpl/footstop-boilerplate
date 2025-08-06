"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Spin,
  message,
  Popconfirm,
  Typography,
  InputNumber,
  Image,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  getAllBrands,
  uploadProductImage,
  deleteProductImage,
} from "../../../../lib/services/adminService";
import type { TableProps, UploadFile } from "antd";

const { Option } = Select;

// --- Tipe Data untuk TypeScript ---
interface Image {
  id_gambar: number;
  url: string;
}
interface Brand {
  id_brand: number;
  brand_name: string;
}
interface Category {
  id_category: number;
  category_name: string;
}
interface Product {
  id_product: number;
  product_name: string;
  price: string;
  size: string;
  brand: Brand;
  category: Category;
  images: Image[];
}

export default function ManageProductsPage() {
  // State untuk data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // State untuk UI
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [form] = Form.useForm();

  // --- Fungsi-fungsi Pengambilan Data ---
  const fetchProducts = async (page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const response = await getAllProducts({ page, limit: pageSize });
      setProducts(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
        current: page,
        pageSize,
      }));
    } catch (error) {
      message.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  // Ambil data saat komponen dimuat
  useEffect(() => {
    fetchProducts(pagination.current, pagination.pageSize);
    getAllCategories().then(setCategories);
    getAllBrands().then(setBrands);
  }, []);

  const handleTableChange: TableProps<Product>["onChange"] = (
    newPagination
  ) => {
    fetchProducts(newPagination.current, newPagination.pageSize);
  };

  // --- Handler untuk Modal ---
  const showCreateModal = () => {
    setEditingProduct(null);
    form.resetFields();
    setFileList([]); // Kosongkan file list untuk produk baru
    setIsModalOpen(true);
  };

  const showEditModal = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      product_name: product.product_name,
      price: parseInt(product.price), // Pastikan harga adalah number untuk InputNumber
      size: product.size,
      id_brand: product.brand.id_brand,
      id_category: product.category.id_category,
    });
    // Konversi gambar yang ada ke format yang dimengerti oleh Ant Design Upload
    const existingImages =
      product.images?.map((img) => ({
        uid: String(img.id_gambar),
        name: img.url.split("/").pop() || "image.png",
        status: "done",
        url: img.url,
      })) || [];
    setFileList(existingImages);
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      let savedProduct;

      // Langkah 1: Simpan/Update data teks produk
      if (editingProduct) {
        savedProduct = await updateProduct(editingProduct.id_product, values);
        message.success("Product details updated.");
      } else {
        savedProduct = await createProduct(values);
        message.success("Product created successfully.");
      }

      // Langkah 2: Upload gambar baru (jika ada)
      const newFiles = fileList.filter((file) => file.originFileObj);
      if (newFiles.length > 0) {
        message.loading({ content: "Uploading images...", key: "uploading" });
        await Promise.all(
          newFiles.map((file) =>
            uploadProductImage(
              savedProduct.id_product,
              file.originFileObj as File
            )
          )
        );
        message.success({
          content: "Images uploaded!",
          key: "uploading",
          duration: 2,
        });
      }

      setIsModalOpen(false);
      fetchProducts(pagination.current, pagination.pageSize); // Refresh tabel
    } catch (error) {
      console.error("Operation failed:", error);
      message.error("An error occurred. Please check the form and try again.");
    }
  };

  // --- Handler untuk Aksi di Tabel ---
  const handleDelete = async (productId: number) => {
    try {
      await deleteProduct(productId);
      message.success("Product deleted successfully.");
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error("Failed to delete product.");
    }
  };

  // Handler untuk menghapus gambar dari server
  const handleRemoveImage = async (file: UploadFile) => {
    if (file.url && file.uid) {
      // Hanya untuk file yang sudah ada di server
      try {
        await deleteProductImage(Number(file.uid));
        message.success("Image removed from server.");
        return true; // Lanjutkan proses hapus dari UI
      } catch {
        message.error("Failed to remove image from server.");
        return false; // Batalkan proses hapus dari UI
      }
    }
    return true; // Izinkan hapus file baru yang belum di-upload
  };

  // Definisi kolom tabel
  const columns: TableProps<Product>["columns"] = [
    {
      title: "ID",
      dataIndex: "id_product",
      key: "id_product",
      fixed: "left",
      width: 80,
    },
    {
      title: "Image",
      dataIndex: "images", // Kita tetap menargetkan array 'images'
      key: "image",
      width: 100,
      // Gunakan fungsi 'render' untuk mengubah data menjadi JSX
      render: (images: Image[], record: Product) => {
        // Cek pengaman: pastikan ada gambar dan URL-nya valid
        if (!images || images.length === 0 || !images[0]?.url) {
          return "No Image";
        }

        // Ambil URL dari gambar pertama di dalam array
        const imageUrl = images[0].url;

        // Render komponen Image dari Next.js
        return (
          <Image
            src={imageUrl}
            alt={record.product_name} // Teks alt yang baik untuk SEO & aksesibilitas
            width={60} // Tentukan lebar
            height={60} // Tentukan tinggi
            style={{ objectFit: "cover", borderRadius: "4px" }} // Style agar gambar tidak gepeng
          />
        );
      },
    },
    { title: "Name", dataIndex: "product_name", key: "product_name" },
    { title: "Brand", dataIndex: ["brand", "brand_name"], key: "brand" },
    {
      title: "Category",
      dataIndex: ["category", "category_name"],
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `Rp ${parseInt(price).toLocaleString()}`,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
          <Popconfirm
            title="Delete this product?"
            onConfirm={() => handleDelete(record.id_product)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Typography.Title level={2}>Manage Products</Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateModal}
        >
          Create Product
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id_product"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />
      <Modal
        title={
          editingProduct
            ? `Edit Product: ${editingProduct.product_name}`
            : "Create New Product"
        }
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText={editingProduct ? "Save Changes" : "Create"}
        destroyOnClose // Reset state form di dalam modal saat ditutup
      >
        <Form form={form} layout="vertical" className="mt-6">
          <Form.Item
            name="product_name"
            label="Product Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price (Rp)"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => parseInt(value!.replace(/\$\s?|(,*)/g, ""))}
            />
          </Form.Item>
          <Form.Item name="size" label="Available Sizes (comma separated)">
            <Input placeholder="e.g., 40, 41, 42, 43" />
          </Form.Item>
          <Form.Item name="id_brand" label="Brand" rules={[{ required: true }]}>
            <Select placeholder="Select a brand">
              {brands.map((brand) => (
                <Option key={brand.id_brand} value={brand.id_brand}>
                  {brand.brand_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="id_category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select a category">
              {categories.map((cat) => (
                <Option key={cat.id_category} value={cat.id_category}>
                  {cat.category_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Product Images">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              onRemove={handleRemoveImage}
              beforeUpload={() => false} // Manual upload control
              multiple
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
