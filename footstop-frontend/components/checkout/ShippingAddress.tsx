export default function ShippingAddress() {
  return (
    <div className="border p-4 rounded-md">
      <h2 className="font-semibold mb-3">Shipping Address</h2>
      <select className="border p-2 rounded w-full">
        <option>Alip House</option>
        {/* Tambah alamat lain jika perlu */}
      </select>
    </div>
  );
}
