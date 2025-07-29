'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Spin, message, Popconfirm, Typography, InputNumber, Image } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  getAllBrands
} from '../../../../lib/services/adminService';
import type { TableProps } from 'antd';

const { Option } = Select;

// Definisikan tipe data
interface Product {
  id_product: number;
  product_name: string;
  price: string;
  size: string;
  brand: { id_brand: number; brand_name: string };
  category: { id_category: number; category_name: string };
  images: { url: string }[];
}
interface Category { id_category: number; category_name: string; }
interface Brand { id_brand: number; brand_name: string; }

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [form] = Form.useForm();

  const fetchProducts = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await getAllProducts({ page, limit: pageSize });
      setProducts(response.data);
      setPagination(prev => ({ ...prev, total: response.total, current: page, pageSize }));
    } catch (error) {
      message.error('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(pagination.current, pagination.pageSize);
    getAllCategories().then(setCategories);
    getAllBrands().then(setBrands);
  }, []);

  const handleTableChange: TableProps<Product>['onChange'] = (newPagination) => {
    fetchProducts(newPagination.current, newPagination.pageSize);
  };

  const showCreateModal = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      product_name: product.product_name,
      price: product.price,
      size: product.size,
      id_brand: product.brand.id_brand,
      id_category: product.category.id_category,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: number) => {
    try {
      await deleteProduct(productId);
      message.success('Product deleted successfully.');
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Failed to delete product.');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct) {
        await updateProduct(editingProduct.id_product, values);
        message.success('Product updated successfully.');
      } else {
        await createProduct(values);
        message.success('Product created successfully.');
      }
      setIsModalOpen(false);
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('Validation Failed:', error);
      message.error('Operation failed. Please check the form.');
    }
  };

  const columns: TableProps<Product>['columns'] = [
    { title: 'ID', dataIndex: 'id_product', key: 'id_product' },
    {
        title: 'Image',
        dataIndex: 'images',
        key: 'image',
        render: (images) => images?.[0]?.url ? <Image src={images[0].url} alt="product" width={50} height={50} style={{ objectFit: 'cover' }} /> : 'No Image'
    },
    { title: 'Name', dataIndex: 'product_name', key: 'product_name' },
    { title: 'Brand', dataIndex: ['brand', 'brand_name'], key: 'brand' },
    { title: 'Category', dataIndex: ['category', 'category_name'], key: 'category' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => `Rp ${parseInt(price).toLocaleString()}` },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Popconfirm title="Delete this product?" onConfirm={() => handleDelete(record.id_product)}>
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
        <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>Create Product</Button>
      </div>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id_product"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: true }}
      />
      <Modal
        title={editingProduct ? 'Edit Product' : 'Create New Product'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText={editingProduct ? 'Save Changes' : 'Create'}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="product_name" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price (Rp)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="size" label="Size">
            <Input />
          </Form.Item>
          <Form.Item name="id_brand" label="Brand" rules={[{ required: true }]}>
            <Select placeholder="Select a brand">
              {brands.map(brand => <Option key={brand.id_brand} value={brand.id_brand}>{brand.brand_name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="id_category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select a category">
              {categories.map(cat => <Option key={cat.id_category} value={cat.id_category}>{cat.category_name}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}