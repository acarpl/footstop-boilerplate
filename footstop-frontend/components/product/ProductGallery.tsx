'use client';

import Image from 'next/image';

interface ProductGalleryProps {
  images: { url: string }[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const mainImage = images?.[0]?.url || '/placeholder-image.jpg';

  return (
    <div>
      <Image
        src={mainImage}
        alt="Product Image"
        width={500}
        height={500}
        className="rounded-lg w-full object-cover"
      />
    </div>
  );
}
