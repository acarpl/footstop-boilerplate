"use client";

import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Spin } from "antd";
import { useRouter } from "next/navigation";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect jika selesai loading tapi user tidak ada
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Selagi memverifikasi sesi
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Jika user ada, render konten
  return <>{children}</>;
}
