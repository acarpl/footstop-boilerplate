'use client';

import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Spin, Typography, Empty } from 'antd';
import { getDashboardStats } from '../../../../lib/services/adminService';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulasi pengambilan data dari backend
        const fetchData = async () => {
            try {
                // Ganti ini dengan panggilan API asli nanti
                // const data = await getDashboardStats();
                const data = await new Promise(resolve => setTimeout(() => resolve({
                    totalRevenue: 56430000,
                    newOrders: 12,
                    totalUsers: 150,
                }), 1000));
                
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
                // Jika API gagal, stats akan tetap null
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 1. Tampilkan loading spinner selagi data diambil
    if (loading) {
        return <div className="text-center p-10"><Spin size="large" /></div>;
    }

    // 2. SETELAH loading selesai, periksa apakah data 'stats' benar-benar ada.
    // Ini adalah jaring pengaman jika API gagal atau mengembalikan data kosong.
    if (!stats) {
        return <Empty description="Could not load dashboard data. Please try again later." />;
    }

    // 3. Hanya jika loading selesai DAN stats ada, render konten utama.
    return (
        <div>
            <Typography.Title level={2}>Dashboard</Typography.Title>
            <Row gutter={16}>
                <Col span={8}>
                    {/* Sekarang aman untuk mengakses stats.totalRevenue */}
                    <Card><Statistic title="Total Revenue" value={`Rp ${stats.totalRevenue.toLocaleString()}`} /></Card>
                </Col>
                <Col span={8}>
                    <Card><Statistic title="New Orders (Today)" value={stats.newOrders} /></Card>
                </Col>
                <Col span={8}>
                    <Card><Statistic title="Total Users" value={stats.totalUsers} /></Card>
                </Col>
            </Row>
            {/* Anda bisa menambahkan komponen grafik atau tabel di sini */}
        </div>
    );
}