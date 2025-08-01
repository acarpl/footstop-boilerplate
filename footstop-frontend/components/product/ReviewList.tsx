'use client';

interface Review {
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="space-y-4">
      {reviews?.map((review, index) => (
        <div
          key={index}
          className="border p-4 rounded-lg bg-white shadow-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">{review.user_name}</div>
            <div className="text-sm text-gray-500">
              Posted on {new Date(review.created_at).toLocaleDateString()}
            </div>
          </div>
          <div className="text-yellow-500 mb-1">
            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
          </div>
          <div className="text-gray-700">{review.comment}</div>
        </div>
      ))}
      {reviews?.length === 0 && (
        <div className="text-gray-500 text-sm">No reviews yet.</div>
      )}
    </div>
  );
}
