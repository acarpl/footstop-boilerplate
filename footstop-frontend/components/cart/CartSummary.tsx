interface OrderSummaryProps {
  subtotal: number
  discount: number
  deliveryFee: number
  total: number
}

export default function OrderSummary({ subtotal, discount, deliveryFee, total }: OrderSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow w-full max-w-md ml-auto">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-red-500">
          <span>Discount</span>
          <span>Rp {discount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>Rp {deliveryFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-4 border-t">
          <span>Total</span>
          <span>Rp {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
