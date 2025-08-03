// file: components/product/FAQList.tsx
type FAQ = {
  question: string;
  answer: string;
};

export default function FAQList({ faqs }: { faqs?: FAQ[] }) {
  if (!faqs || faqs.length === 0) {
    return <div className="text-gray-500">No FAQs available.</div>;
  }

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold mb-3">FAQs</h2>
      {faqs.map((faq, i) => (
        <div key={i} className="border-b pb-2">
          <p className="font-semibold">{faq.question}</p>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}
