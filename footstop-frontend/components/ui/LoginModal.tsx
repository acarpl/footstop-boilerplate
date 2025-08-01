'use client';
import { Modal, Button, Input } from 'antd';

export default function LoginModal({
  visible,
  onCancel,
  email,
  setEmail,
  password,
  setPassword,
  onLogin,
}: {
  visible: boolean;
  onCancel: () => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  onLogin: () => void;
}) {
  return (
    <Modal open={visible} onCancel={onCancel} footer={null} centered>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">FOOTSTOP</h2>
        <p className="text-lg font-semibold">Welcome Back!</p>
        <p className="text-sm text-gray-500 mb-4">Log in to your account</p>

        <Input placeholder="e.g name@example.com" className="mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input.Password placeholder="Password" className="mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="primary" className="w-full bg-red-600 hover:bg-red-700" onClick={onLogin}>
          Log in
        </Button>

        <p className="mt-4 text-sm">
          Don’t have an account? <span className="text-blue-600 cursor-pointer underline">Register Here!</span>
        </p>
      </div>
    </Modal>
  );
}
