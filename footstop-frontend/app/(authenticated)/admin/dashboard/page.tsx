"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "../../../../lib/services/adminService";
import { Card, Col, Row, Statistic, Spin, Typography, Alert } from "antd";
import type { DashboardStats } from "../../../../lib/services/adminService"; // Assuming you have this type

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching dashboard stats...");
        const data = await getDashboardStats();

        if (!data) {
          throw new Error("No data received from server");
        }

        // Validate the expected properties
        const requiredProps = ["totalRevenue", "newOrders", "totalUsers"];
        const isValidData = requiredProps.every((prop) => prop in data);

        if (!isValidData) {
          throw new Error("Data format is invalid");
        }

        console.log("Stats fetched successfully:", data);
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert
          message="Error Loading Dashboard"
          description={error}
          type="error"
          showIcon
        />
        <div className="mt-4 text-center">
          <Typography.Text type="secondary">
            Please try refreshing the page or check your connection
          </Typography.Text>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4">
        <Alert
          message="No Data Available"
          description="The dashboard data could not be loaded."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Typography.Title level={2} className="mb-6">
        Admin Dashboard
      </Typography.Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              precision={2}
              prefix="Rp "
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card hoverable>
            <Statistic
              title="New Orders (Today)"
              value={stats.newOrders}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card hoverable>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>

        {/* You can add more stats columns here as needed */}
      </Row>
    </div>
  );
}
