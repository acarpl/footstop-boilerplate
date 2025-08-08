import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative w-full h-screen pt-20">
      <Image
        src="/images/hero-bnr.png"
        alt="Hero banner"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
    </div>
  );
}
