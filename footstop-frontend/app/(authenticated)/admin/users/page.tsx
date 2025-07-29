'use client';

import React, { useState, useEffect } from 'react';
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
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllUsers, updateUserByAdmin, deleteUser } from '../../../../lib/services/adminService'; // Sesuaikan path jika perlu
import type { TableProps } from 'antd'; // Import tipe untuk Ant Design

const { Option } = Select;

// 1. Definisikan tipe data untuk User agar konsisten
interface User {
  id_user: number;
  username: string;
  email: string;
  phone_number: string;
  role: {
    id_role: number;
    nama_role: string;
  };
}

// Definisikan tipe untuk data paginasi
interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Menggunakan 'open' bukan 'visible'
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({ current: 1, pageSize: 10, total: 0 });
  const [form] = Form.useForm();

  // Fungsi untuk mengambil data dari backend
  const fetchUsers = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await getAllUsers({ page, limit: pageSize });
      setUsers(response.data);
      setPagination({
        current: response.page,
        pageSize: response.limit,
        total: response.total,
      });
    } catch (error) {
      message.error('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  // Mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize);
  }, []);

  // Handler saat paginasi di tabel berubah
  const handleTableChange: TableProps<User>['onChange'] = (newPagination) => {
    fetchUsers(newPagination.current, newPagination.pageSize);
  };

  // 2. Perbaiki tipe 'user' di sini
  const showEditModal = (user: User) => {
    setEditingUser(user);
    // Set nilai form dengan data user yang akan diedit
    form.setFieldsValue({
      username: user.username,
      phone_number: user.phone_number,
      id_role: user.role.id_role,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId);
      message.success('User deleted successfully.');
      fetchUsers(pagination.current, pagination.pageSize); // Refresh tabel
    } catch (error) {
      message.error('Failed to delete user.');
    }
  };

  const handleModalOk = async () => {
    // 3. Tambahkan pengaman jika tidak ada user yang diedit
    if (!editingUser) return;

    try {
      const values = await form.validateFields();
      await updateUserByAdmin(editingUser.id_user, values);
      message.success('User updated successfully.');
      setIsModalOpen(false);
      fetchUsers(pagination.current, pagination.pageSize); // Refresh tabel
    } catch (error) {
      // Tidak perlu menampilkan pesan error di sini karena validateFields sudah menampilkannya di form
      console.error('Validation Failed:', error);
    }
  };
  
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  // Definisi kolom untuk tabel Ant Design
  const columns: TableProps<User>['columns'] = [
    { title: 'ID', dataIndex: 'id_user', key: 'id_user', width: 80 },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone_number', key: 'phone_number' },
    { title: 'Role', dataIndex: ['role', 'nama_role'], key: 'role' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => ( // Tipe 'record' akan otomatis diinfer dari dataSource
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the user"
            description="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id_user)}
            okText="Yes"
            cancelText="No"
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
        <Typography.Title level={2}>Manage Users</Typography.Title>
        {/* Tombol Create User bisa diaktifkan nanti */}
        {/* <Button type="primary" icon={<PlusOutlined />}>Create User</Button> */}
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id_user"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: true }} // Membuat tabel bisa di-scroll horizontal di layar kecil
      />
      {/* Modal untuk mengedit user */}
      <Modal
        title={`Edit User: ${editingUser?.username || ''}`}
        open={isModalOpen} // Menggunakan 'open'
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save Changes"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone_number" label="Phone Number">
            <Input />
          </Form.Item>
          <Form.Item name="id_role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select a role">
              <Option value={1}>admin</Option>
              <Option value={2}>customer</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}