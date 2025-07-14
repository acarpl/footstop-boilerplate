"use client";

import Navbar from "#/components/Navbar";
import Footer from "#/components/Footer";
import { useAuth } from "#/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    profile_picture: user?.profile_picture || ""
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string); // Preview sebelum upload
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id_user", String(user.id_user)); // dikirim ke NestJS

    try {
      const res = await fetch("http://localhost:3000/uploads", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload gagal");

      const data = await res.json();
      setForm((prev) => ({ ...prev, profile_picture: data.url }));
    } catch (err) {
      console.error("Gagal upload gambar:", err);
    }
  };

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50">
      <section className="flex-grow w-full max-w-4xl p-6 md:p-10 flex flex-col md:flex-row gap-6 bg-white shadow-lg rounded-xl mt-10">
        {/* Kiri: Foto */}
        <div className="flex flex-col items-center md:w-1/3">
          <div className="border-4 border-red-500 rounded-full p-1">
            <Image
              src={
                preview ||
                form.profile_picture ||
                user.profile_picture ||
                "/profile.jpg"
              }
              alt="Profile"
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <label className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition cursor-pointer">
            Ubah Foto
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Kanan: Info User */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-black">{user.username}</h1>
            <Pencil className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
          </div>

          <div className="text-sm md:text-base space-y-2 text-gray-700">
            <p>
              <strong>Nomor Telepon:</strong>{" "}
              {user.phone_number || "081******789"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {user.email ? (
                <span className="text-blue-600 underline">{user.email}</span>
              ) : (
                <span className="text-purple-600 underline cursor-pointer">
                  Tambah Email
                </span>
              )}
            </p>
            <p>
              <strong>Jenis Kelamin:</strong> {user.gender || "Pria"}
            </p>
            <p>
              <strong>Alamat:</strong>{" "}
              <span className="underline">
                {user.address || "Jl. Raya Ngawi No. 1"}
              </span>
            </p>
            <p>
              <strong>Kode Pos:</strong> {user.postal_code || "63211 – 63218"}
            </p>
            <p>
              <strong>Kota:</strong>{" "}
              <span className="underline">
                {user.city || "Kabupaten Ngawi"}
              </span>
            </p>
          </div>

          <div className="mt-8 flex gap-2 flex-wrap text-sm md:text-base">
            <button className="bg-black text-white px-4 py-2 rounded-full">
              Chart
            </button>
            <button className="bg-black text-white px-4 py-2 rounded-full">
              History
            </button>
            <button className="bg-black text-white px-4 py-2 rounded-full">
              Shop
            </button>
            <button className="bg-black text-white px-4 py-2 rounded-full">
              Brands
            </button>
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={() => router.push("/account")}
              className="w-full px-4 py-2 border rounded-md hover:bg-gray-100 transition"
            >
              Account Settings
            </button>
            <button
              onClick={() => router.push("/orders")}
              className="w-full px-4 py-2 border rounded-md hover:bg-gray-100 transition"
            >
              My Orders
            </button>
            <button
              onClick={logout}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
