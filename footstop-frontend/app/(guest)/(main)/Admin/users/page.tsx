// app/admin/users/page.tsx
'use client';
import { Table } from 'antd';
import { useEffect, useState } from 'react';

export default function UserListPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Ganti dengan fetch dari NestJS
    setUsers([
      { key: '1', name: 'John Doe', email: 'john@example.com' },
      { key: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ]);
  }, []);

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <Table dataSource={users} columns={columns} />
    </>
  );
}
