'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Spin, message, Popconfirm, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getAllCategoriesAdmin, createCategory, updateCategory, deleteCategory } from '../../../../lib/services/adminService';
import type { TableProps } from 'antd';

// Definisikan tipe data
interface Category {
  id_category: number;
  category_name: string;
}

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getAllCategoriesAdmin();
      setCategories(response);
    } catch (error) {
      message.error('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showCreateModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({ category_name: category.category_name });
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId);
      message.success('Category deleted successfully.');
      fetchCategories(); // Refresh tabel
    } catch (error) {
      message.error('Failed to delete category.');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await updateCategory(editingCategory.id_category, values);
        message.success('Category updated successfully.');
      } else {
        await createCategory(values);
        message.success('Category created successfully.');
      }
      setIsModalOpen(false);
      fetchCategories(); // Refresh tabel
    } catch (error) {
      message.error('Operation failed. Please check the form.');
    }
  };
  
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const columns: TableProps<Category>['columns'] = [
    { title: 'ID', dataIndex: 'id_category', key: 'id_category', width: 80 },
    { title: 'Category Name', dataIndex: 'category_name', key: 'category_name' },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Popconfirm title="Delete this category?" onConfirm={() => handleDelete(record.id_category)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Typography.Title level={2}>Manage Categories</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>Create Category</Button>
      </div>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id_category"
        loading={loading}
      />
      <Modal
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingCategory ? 'Save Changes' : 'Create'}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="category_name" label="Category Name" rules={[{ required: true, message: 'Please enter the category name' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}