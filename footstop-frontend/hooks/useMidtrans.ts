// hooks/useMidtrans.ts
import { useState, useEffect } from "react";

// URL skrip Snap.js (Sandbox)
const MIDTRANS_SCRIPT_URL = "https://app.sandbox.midtrans.com/snap/snap.js";
// Gunakan URL ini untuk produksi: 'https://app.midtrans.com/snap/snap.js'

const useMidtrans = () => {
  const [snap, setSnap] = useState<any>(null);

  useEffect(() => {
    // Fungsi untuk memuat skrip
    const loadSnapScript = () => {
      const script = document.createElement("script");
      script.src = MIDTRANS_SCRIPT_URL;
      script.setAttribute(
        "data-client-key",
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
      );
      script.async = true;

      script.onload = () => {
        // 'snap' sekarang tersedia di objek window
        setSnap((window as any).snap);
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    loadSnapScript();
  }, []);

  // Fungsi untuk memicu pembayaran
  const pay = (transactionToken: string, callbacks: any) => {
    if (snap) {
      snap.embed(transactionToken, {
        embedId: "snap-container", // ID div tempat snap akan di-mount
        ...callbacks,
      });
    }
  };

  return { pay, isSnapReady: !!snap };
};

export default useMidtrans;
