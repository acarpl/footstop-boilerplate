"use client";

import React, { useState } from "react";
import { Button, Card, Checkbox, Form, Input, Row, Col, Typography } from 'antd';

const Login = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values: any) => {
        console.log('Login form values:', values);
        setLoading(true);
        setTimeout(() => setLoading(false), 1500); // Simulasi loading
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#963535', backgroundImage: 'url(backgrounds/footstop-pattern.svg)', backgroundSize: 'contain' }}>
            <Card className="shadow-xl rounded-2xl" style={{ width: 350, textAlign: 'center' }}>
                <Typography.Title level={3} style={{ color: '#E53935' }}>FOOTSTOP</Typography.Title>
                <Typography.Text strong>Welcome Back!</Typography.Text>
                <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 20 }}>
                    <Form.Item label="E-mail" name="email" rules={[{ required: true, message: 'Please input your E-mail!' }]}>
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
                    <Typography.Text>Don't have any account? <a href="/register">Register Here!</a></Typography.Text>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
