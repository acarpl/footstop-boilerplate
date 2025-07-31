export default function PromoInput({ onApply }: { onApply: (code: string) => void }) {
  return (
    <div className="flex mt-4">
      <input
        type="text"
        placeholder="Add promo code"
        className="border px-3 py-2 w-full rounded-l-md"
      />
      <button
        className="bg-black text-white px-4 rounded-r-md"
        onClick={() => onApply('DISCOUNT20')}
      >
        Apply
      </button>
    </div>
  )
}

//4. Contoh Koneksi ke Backend (lib/api.ts)
//export const fetchCart = async () => {
//  const res = await fetch('/api/cart', { cache: 'no-store' })
//return res.json()
//}

//export const updateQuantity = async (id: string, qty: number) => {
 // return fetch(`/api/cart/${id}`, {
 //   method: 'PUT',
 //   headers: { 'Content-Type': 'application/json' },
 //   body: JSON.stringify({ quantity: qty }),
 // })
//}