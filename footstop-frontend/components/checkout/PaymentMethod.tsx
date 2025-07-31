export default function PaymentMethod() {
  const methods = [
    'Credit/Debit Card',
    'ATM/Bank Transfer',
    'GoPay/e-Wallets',
    'KlikBCA',
    'ShopeePay',
    'OCTO Clicks',
    'Indomaret',
    'Alfa Group',
    'Akulaku',
  ];

  return (
    <div className="border p-4 rounded-md">
      <h2 className="font-semibold mb-3">Select Payment</h2>
      <ul className="space-y-2">
        {methods.map((m) => (
          <li
            key={m}
            className="border px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
          >
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}
