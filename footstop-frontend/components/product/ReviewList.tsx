// file: components/product/ReviewList.tsx
type Review = {
  id?: number;
  user?: string;
  rating?: number;
  comment?: string;
};

export default function ReviewList({ reviews }: { reviews?: Review[] }) {
  if (!reviews || reviews.length === 0) {
    return <div className="text-gray-500">No reviews yet.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Reviews</h2>
      {reviews.map((rev, i) => (
        <div key={i} className="border-b pb-2">
          <p className="font-semibold">{rev.user || 'Anonymous'}</p>
          <p>Rating: {rev.rating ?? 'N/A'}/5</p>
          <p>{rev.comment}</p>
        </div>
      ))}
    </div>
  );
}
