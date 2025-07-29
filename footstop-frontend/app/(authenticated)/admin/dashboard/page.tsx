'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../../../lib/services/adminService';
import { Card, Col, Row, Statistic, Spin, Typography } from 'antd';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Dashboard component mounted. Fetching stats...");

        getDashboardStats()
            .then(data => {
                console.log("✅ Stats fetched successfully:", data);
                // Periksa apakah data memiliki properti yang kita harapkan
                if (data && typeof data.totalRevenue !== 'undefined') {
                    setStats(data);
                } else {
                    console.error("Data received is not in the expected format:", data);
                    setStats(null); // Set ke null jika format salah
                }
            })
            .catch(err => {
                console.error("❌ Failed to fetch dashboard stats. Error object:", err);
                if (err.response) {
                    console.error("Error response data:", err.response.data);
                }
            })
            .finally(() => {
                console.log("Finished fetching. Setting loading to false.");
                setLoading(false);
            });
    }, []);

    console.log("Component rendering. Loading state:", loading, "Stats state:", stats);

    if (loading) {
        return <div className="text-center"><Spin /></div>;
    }

    // Periksa lagi di sini untuk memastikan stats tidak null
    if (!stats) {
        return <div>Failed to load dashboard data. Please check the console for errors.</div>;
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
        </div>
    );
}