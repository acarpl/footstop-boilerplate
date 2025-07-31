export default function OrderSummary() {
  return (
    <div className="border p-4 rounded-md">
      <h2 className="font-semibold mb-3">Item</h2>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <img src="/shoe.png" className="w-12 h-12 object-cover" />
          <div>
            <p>Wholesale original sneakers</p>
            <button className="text-sm text-red-500">Remove</button>
          </div>
        </div>
        <span>Rp.1.220.000</span>
      </div>
      <div className="border-t pt-2 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rp.1.220.000</span>
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <span>Rp.0</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Rp.0</span>
        </div>
      </div>
      <div className="flex justify-between font-bold text-lg mt-3">
        <span>Total</span>
        <span>Rp.1.220.000</span>
      </div>
      <button className="w-full mt-4 bg-black text-white py-3 rounded hover:bg-gray-800">
        Checkout
      </button>
    </div>
  );
}
