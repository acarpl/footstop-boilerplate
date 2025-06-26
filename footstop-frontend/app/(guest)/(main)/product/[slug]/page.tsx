// app/(guest)/(main)/product/[slug]/page.tsx
import ProductDetail from "#/components/product/ProductDetail";

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductDetail slug={params.slug} />;
}
