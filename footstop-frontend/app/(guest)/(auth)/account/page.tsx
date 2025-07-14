"use client";

import { useState, useEffect } from "react";
import { useAuth } from "#/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone_number: "",
    gender: "Pria",
    address: "",
    province: "",
    city: "",
    postal_code: "",
    profile_picture: ""
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        gender: user.gender || "",
        address: user.address || "",
        province: user.province || "",
        city: user.city || "",
        postal_code: user.postal_code || "",
        profile_picture: user.profile_picture || "/profile.jpg"
      });
      setPreview(user.profile_picture || "/profile.jpg");
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id_user", String(user.id_user));

    try {
      const res = await fetch("http://localhost:3001/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Upload failed");

      setForm((prev) => ({ ...prev, profile_picture: data.url }));
      setMessage("✅ Foto berhasil diupload");
    } catch (err) {
      setMessage("❌ Upload gagal");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Gagal update data.");

      setMessage("✅ Data berhasil disimpan!");
      router.refresh();
    } catch (err: any) {
      setMessage("❌ Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return <p className="text-center mt-20">Loading data...</p>;
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center px-4 py-8"
      style={{
        backgroundColor: '#963535',
        backgroundImage: 'url(/backgrounds/footstop-pattern.svg)',
        backgroundSize: 'contain',
      }}
    >
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-6 text-center">Edit Profil</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <Image
              src={preview || "/profile.jpg"}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
            <input
              type="text"
              name="profile_picture"
              value={form.profile_picture}
              onChange={handleChange}
              placeholder="URL foto profil"
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Nama Lengkap"
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="text"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="No. HP"
            className="w-full border px-3 py-2 rounded-md"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="Pria">Pria</option>
            <option value="Wanita">Wanita</option>
          </select>

          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Alamat"
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="text"
            name="province"
            value={form.province}
            onChange={handleChange}
            placeholder="Provinsi"
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Kota/Kabupaten"
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="text"
            name="postal_code"
            value={form.postal_code}
            onChange={handleChange}
            placeholder="Kode Pos"
            className="w-full border px-3 py-2 rounded-md"
          />

          {message && <p className="text-center text-sm text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </main>
  );
}
