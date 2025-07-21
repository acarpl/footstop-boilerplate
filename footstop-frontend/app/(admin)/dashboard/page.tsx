'use client';

import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Spin, Typography } from 'antd';
import { getDashboardStats } from '../../../lib/services/adminService';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats()
            .then(data => setStats(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="text-center"><Spin /></div>;
    }

    return (
        <div>
            <Typography.Title level={2}>Dashboard</Typography.Title>
            <Row gutter={16}>
                <Col span={8}>
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