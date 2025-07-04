"use client";

import React, { useState } from "react";
import { Button, Card, Checkbox, Form, Input, Row, Col, Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import apiClient from '../../../../lib/apiClient';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // Inisialisasi router

    // 4. Ganti fungsi onFinish dengan logika panggilan API
    const onFinish = async (values: { email: any; password: any; }) => {
        setLoading(true);
        try {
            // Panggil endpoint login di backend
            await apiClient.post('/auth/login', {
                email: values.email,
                password: values.password,
            });

            // Jika berhasil, backend sudah mengatur cookie
            message.success('Login successful! Redirecting...');

            // Arahkan ke halaman dashboard setelah jeda singkat
            setTimeout(() => {
                router.push('/dashboard'); // Ganti '/dashboard' dengan halaman tujuan Anda
                router.refresh(); // Penting untuk me-refresh state di server
            }, 1000);

        } catch (err) {
            // Tangkap dan tampilkan pesan error dari backend
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            message.error(errorMessage);
            setLoading(false); // Hentikan loading jika error
        }
        // setLoading(false) akan di-handle di dalam blok try/catch
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#963535', backgroundImage: 'url(/backgrounds/footstop-pattern.svg)', backgroundSize: 'contain' }}>
            <Card className="shadow-xl rounded-2xl" style={{ width: 350, textAlign: 'center' }}>
                <Typography.Title level={3} style={{ color: '#E53935' }}>FOOTSTOP</Typography.Title>
                <Typography.Text strong>Welcome Back!</Typography.Text>
                <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 20 }}>
                    <Form.Item label="E-mail" name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid E-mail!' }]}>
                        <Input placeholder="eg. farhankebab@example.com" />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
                        <Input.Password placeholder="Type your Password Here!" />
                    </Form.Item>
                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" block htmlType="submit" loading={loading} className="bg-red-600 hover:bg-red-700">
                            Log In
                        </Button>
                    </Form.Item>
                    <Typography.Text>Don&apos;t have any account? <a href="/register">Register Here!</a></Typography.Text>
                </Form>
            </Card>
        </div>
    );
};

export default Login;