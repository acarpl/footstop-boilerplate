"use client";

import React, { useState } from "react";
import { Button, Card, Form, Input, Row, Col, Typography, message } from 'antd'; // 1. Import 'message'
import { useRouter } from 'next/navigation'; // 2. Import useRouter
import apiClient from '../../../../lib/apiClient'; // 3. Import API client

const Register = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // Inisialisasi router

    // 4. Ganti fungsi onFinish dengan logika panggilan API
    const onFinish = async (values: { username: any; phoneNumber: any; email: any; password: any; }) => {
        setLoading(true);
        try {
            await apiClient.post('/auth/register', {
                username: values.username, 
                phone_number: values.phoneNumber, 
                email: values.email,
                password: values.password,
            });

            message.success('Registration successful! Please log in.');

            // Arahkan ke halaman login setelah jeda singkat
            setTimeout(() => {
                router.push('/login');
            }, 1500);

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            message.error(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#963535', backgroundImage: 'url(/backgrounds/footstop-pattern.svg)', backgroundSize: 'contain' }}>
            <Card className="shadow-xl rounded-2xl" style={{ width: 350, textAlign: 'center' }}>
                <Typography.Title level={3} style={{ color: '#E53935' }}>FOOTSTOP</Typography.Title>
                <Typography.Text strong>Welcome To FootStop!</Typography.Text>
                <Typography.Paragraph style={{ fontSize: 12 }}>
                    Create your account and enjoy all the features and discounts.
                </Typography.Paragraph>
                <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 20 }}>
                    {/* Mengubah 'name' menjadi 'username' lebih disarankan, tapi kita sesuaikan di onFinish */}
                    <Form.Item label="Name (Username)" name="name" rules={[{ required: true, message: 'Please input your Name!' }]}>
                        <Input placeholder="eg. Farhan Kebab" />
                    </Form.Item>
                    <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: 'Please input your Phone Number!' }]}>
                        <Input placeholder="eg. 0812345678910" />
                    </Form.Item>
                    <Form.Item label="E-mail" name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid E-mail!' }]}>
                        <Input placeholder="eg. farhankebab@example.com" />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters!' }]}>
                        <Input.Password placeholder="Type your Password Here!" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" block htmlType="submit" loading={loading} className="bg-red-600 hover:bg-red-700">
                            Create Account
                        </Button>
                    </Form.Item>
                    <Typography.Text>Already have account? <a href="/login">Login Here!</a></Typography.Text>
                </Form>
            </Card>
        </div>
    );
};

export default Register;