"use client";
import React, { useState, useEffect } from "react";
import {
  getMyOrders,
  OrderSummary,
  formatCurrency,
} from "../../../lib/services/orderService";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await getMyOrders();
      setOrders(ordersData);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "delivered":
      case "dikirim":
      case "selesai":
        return "bg-green-100 text-green-800";
      case "shipped":
      case "dalam pengiriman":
      case "dikirim":
        return "bg-blue-100 text-blue-800";
      case "processing":
      case "diproses":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "dibatalkan":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string | null | undefined) => {
    if (!status) return "Status Tidak Diketahui";

    // You can customize this based on your status values
    const statusMap: { [key: string]: string } = {
      pending: "Menunggu Konfirmasi",
      processing: "Diproses",
      shipped: "Dalam Pengiriman",
      delivered: "Terkirim",
      cancelled: "Dibatalkan",
    };

    return statusMap[status.toLowerCase()] || status;
  };

  const formatOrderDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFirstProductImage = (order: OrderSummary) => {
    if (order.orderDetails && order.orderDetails.length > 0) {
      const firstProduct = order.orderDetails[0];
      if (
        firstProduct.product.images &&
        firstProduct.product.images.length > 0
      ) {
        return firstProduct.product.images[0].url;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Pesanan Saya
          </h1>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Memuat pesanan...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Pesanan Saya
          </h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-lg font-medium mb-2">Error</div>
            <div className="text-red-700 mb-4">{error}</div>
            <button
              onClick={getAllOrders}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 mt-10">
          <h1 className="text-3xl font-bold text-gray-900">Pesanan Saya</h1>
          <button
            onClick={getAllOrders}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-500 text-lg mb-2">Belum ada pesanan</div>
            <div className="text-gray-400">
              Anda belum melakukan pemesanan apapun.
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id_order}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-4">
                      {getFirstProductImage(order) && (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={getFirstProductImage(order)!}
                            alt="Product"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Pesanan #{order.id_order}
                        </h3>
                        <p className="text-gray-600">
                          {formatOrderDate(order.order_date)}
                        </p>
                        <div className="mt-2">
                          {order.orderDetails &&
                            order.orderDetails.length > 0 && (
                              <p className="text-sm text-gray-500">
                                {order.orderDetails.length} produk
                                {order.orderDetails.length > 1 && (
                                  <span>
                                    {" "}
                                    (+{order.orderDetails.length - 1} lainnya)
                                  </span>
                                )}
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status_pengiriman
                        )}`}
                      >
                        {getStatusLabel(order.status_pengiriman)}
                      </span>
                      <div className="text-lg font-bold text-gray-900 mt-2">
                        {formatCurrency(parseFloat(order.total_price))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                    <button
                      onClick={() => {
                        // Navigate to order detail page
                        // You can implement navigation logic here
                        console.log("View order details:", order.id_order);
                      }}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Lihat Detail
                    </button>

                    {order.status_pengiriman?.toLowerCase() === "delivered" ||
                    order.status_pengiriman?.toLowerCase() === "selesai" ? (
                      <>
                        <button
                          onClick={() => {
                            // Implement reorder functionality
                            console.log("Reorder:", order.id_order);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Pesan Lagi
                        </button>
                        <button
                          onClick={() => {
                            // Navigate to review page
                            console.log("Review order:", order.id_order);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Beri Ulasan
                        </button>
                      </>
                    ) : order.status_pengiriman?.toLowerCase() === "pending" ||
                      order.status_pengiriman?.toLowerCase() ===
                        "processing" ? (
                      <button
                        onClick={() => {
                          // Implement cancel order functionality
                          console.log("Cancel order:", order.id_order);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Batalkan Pesanan
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
