'use client';
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Spin, message, Popconfirm, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getAllBrandsAdmin, createBrand, updateBrand, deleteBrand } from '../../../../lib/services/adminService';
import type { TableProps } from 'antd';
// Definisikan tipe data
interface Brand {
id_brand: number;
brand_name: string;
}
export default function ManageBrandsPage() {
const [brands, setBrands] = useState<Brand[]>([]);
const [loading, setLoading] = useState(true);
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
const [form] = Form.useForm();
const fetchBrands = async () => {
setLoading(true);
try {
const response = await getAllBrandsAdmin();
setBrands(response);
} catch (error) {
message.error('Failed to fetch brands.');
} finally {
setLoading(false);
}
};
useEffect(() => {
fetchBrands();
}, []);
const showCreateModal = () => {
setEditingBrand(null);
form.resetFields();
setIsModalOpen(true);
};
const showEditModal = (brand: Brand) => {
setEditingBrand(brand);
form.setFieldsValue({ brand_name: brand.brand_name });
setIsModalOpen(true);
};
const handleDelete = async (brandId: number) => {
try {
await deleteBrand(brandId);
message.success('Brand deleted successfully.');
fetchBrands(); // Refresh tabel
} catch (error) {
message.error('Failed to delete brand.');
}
};
const handleModalOk = async () => {
try {
const values = await form.validateFields();
if (editingBrand) {
await updateBrand(editingBrand.id_brand, values);
message.success('Brand updated successfully.');
} else {
await createBrand(values);
message.success('Brand created successfully.');
}
setIsModalOpen(false);
fetchBrands(); // Refresh tabel
} catch (error) {
message.error('Operation failed. Please check the form.');
}
};
const handleModalCancel = () => {
setIsModalOpen(false);
setEditingBrand(null);
};
const columns: TableProps<Brand>['columns'] = [
{ title: 'ID', dataIndex: 'id_brand', key: 'id_brand', width: 80 },
{ title: 'Brand Name', dataIndex: 'brand_name', key: 'brand_name' },
{
title: 'Actions',
key: 'actions',
width: 150,
render: (_, record) => (
<Space size="middle">
<Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
<Popconfirm title="Delete this brand?" onConfirm={() => handleDelete(record.id_brand)}>
<Button icon={<DeleteOutlined />} danger />
</Popconfirm>
</Space>
),
},
];
return (
<div>
<div className="flex justify-between items-center mb-6">
<Typography.Title level={2}>Manage Brands</Typography.Title>
<Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>Create Brand</Button>
</div>
<Table
columns={columns}
dataSource={brands}
rowKey="id_brand"
loading={loading}
/>
<Modal
title={editingBrand ? 'Edit Brand' : 'Create New Brand'}
open={isModalOpen}
onOk={handleModalOk}
onCancel={handleModalCancel}
okText={editingBrand ? 'Save Changes' : 'Create'}
>
<Form form={form} layout="vertical" className="mt-4">
<Form.Item name="brand_name" label="Brand Name" rules={[{ required: true, message: 'Please enter the brand name' }]}>
<Input />
</Form.Item>
</Form>
</Modal>
</div>
);
}