'use client';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQListProps {
  faqs: FAQ[];
}

export default function FAQList({ faqs }: FAQListProps) {
  return (
    <div className="prose max-w-none space-y-2">
      {faqs?.map((faq, index) => (
        <div key={index}>
          <h4 className="font-semibold">{faq.question}</h4>
          <p>{faq.answer}</p>
        </div>
      ))}
      {(!faqs || faqs.length === 0) && (
        <p className="text-gray-500 text-sm">No FAQs available.</p>
      )}
    </div>
  );
}
