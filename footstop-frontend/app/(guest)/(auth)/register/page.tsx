"use client";

import React, { useState } from "react";
import { Button, Card, Form, Input, Row, Col, Typography } from 'antd';

const Register = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values: any) => {
        console.log('Register form values:', values);
        setLoading(true);
        setTimeout(() => setLoading(false), 1500); // Simulasi loading
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#963535', backgroundImage: 'url(backgrounds/footstop-pattern.svg)', backgroundSize: 'contain' }}>
            <Card className="shadow-xl rounded-2xl" style={{ width: 350, textAlign: 'center' }}>
                <Typography.Title level={3} style={{ color: '#E53935' }}>FOOTSTOP</Typography.Title>
                <Typography.Text strong>Welcome To FootStop!</Typography.Text>
                <Typography.Paragraph style={{ fontSize: 12 }}>
                    Create your account and enjoy all the features and discounts.
                </Typography.Paragraph>
                <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 20 }}>
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your Name!' }]}>
                        <Input placeholder="eg. Farhan Kebab" />
                    </Form.Item>
                    <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: 'Please input your Phone Number!' }]}>
                        <Input placeholder="eg. +62 123 4567 8910" />
                    </Form.Item>
                    <Form.Item label="E-mail" name="email" rules={[{ required: true, message: 'Please input your E-mail!' }]}>
                        <Input placeholder="eg. farhankebab@example.com" />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
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
