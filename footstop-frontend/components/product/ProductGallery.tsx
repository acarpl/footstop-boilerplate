// file: components/product/ProductGallery.tsx
type Image = {
  url: string;
};

export default function ProductGallery({ images }: { images: Image[] }) {
  if (!images || images.length === 0) {
    return <div className="text-center text-gray-500">No images available.</div>;
  }

  return (
    <div className="space-y-4">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img.url}
          alt={`Product image ${idx + 1}`}
          className="w-full rounded-lg object-cover max-h-96"
          loading="lazy"
          onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
        />
      ))}
    </div>
  );
}
