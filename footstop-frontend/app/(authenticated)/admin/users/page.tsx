'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Spin, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getAllUsers, updateUserByAdmin, deleteUser } from '../../../../lib/services/adminService';

const { Option } = Select;

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [form] = Form.useForm();

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

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize);
  }, []); // Hanya fetch saat komponen pertama kali dimuat

  const handleTableChange = (pagination: { current: number | undefined; pageSize: number | undefined; }) => {
    fetchUsers(pagination.current, pagination.pageSize);
  };

  const showEditModal = (user: React.SetStateAction<null>) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      phone_number: user.phone_number,
      id_role: user.role.id_role,
    });
    setIsModalVisible(true);
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
    try {
      const values = await form.validateFields();
      await updateUserByAdmin(editingUser.id_user, values);
      message.success('User updated successfully.');
      setIsModalVisible(false);
      fetchUsers(pagination.current, pagination.pageSize); // Refresh tabel
    } catch (error) {
      message.error('Failed to update user.');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id_user', key: 'id_user' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone_number', key: 'phone_number' },
    { title: 'Role', dataIndex: ['role', 'nama_role'], key: 'role' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: { id_user: any; }) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id_user)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Manage Users</h1>
        <Button type="primary" icon={<PlusOutlined />}>Create User</Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id_user"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title="Edit User"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone_number" label="Phone Number">
            <Input />
          </Form.Item>
          <Form.Item name="id_role" label="Role" rules={[{ required: true }]}>
            <Select>
              <Option value={1}>admin</Option>
              <Option value={2}>customer</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}