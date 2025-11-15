"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrip } from "@/hooks/use-trip";
import { getItemById } from "@/lib/data";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tripItems, totalPrice, clearTrip } = useTrip();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const singleItemId = searchParams.get("item");
  const itemsToBook = singleItemId
    ? [getItemById(singleItemId)].filter(Boolean)
    : tripItems.map((tripItem) => getItemById(tripItem.id)).filter(Boolean);

  const total = singleItemId
    ? itemsToBook[0]?.price || 0
    : totalPrice;

  const handleConfirm = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmed(true);
      if (!singleItemId) {
        clearTrip();
      }
    }, 2000);
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-6" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Your booking has been successfully confirmed. You will receive a
            confirmation email shortly.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push("/")} variant="outline">
              Back to Home
            </Button>
            <Button onClick={() => router.push("/trip")}>
              View Trip Planner
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Booking Summary</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Items to Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {itemsToBook.map((item) => {
                      if (!item) return null;
                      return (
                        <div
                          key={item.id}
                          className="flex items-start justify-between pb-4 border-b last:border-0"
                        >
                          <div>
                            <h3 className="font-semibold text-lg">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.location}
                            </p>
                            <span className="inline-block mt-2 px-2 py-1 bg-gray-100 rounded text-xs">
                              {item.type}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold">
                              {item.price === 0 ? (
                                <span className="text-green-600">Free</span>
                              ) : (
                                `$${item.price}`
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Price Breakdown */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Price Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {itemsToBook.map((item) => {
                      if (!item) return null;
                      return (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">{item.name}</span>
                          <span className="font-medium">
                            {item.price === 0 ? "Free" : `$${item.price}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Service Fee</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleConfirm}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Confirm & Pay
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    This is a demo. No actual payment will be processed.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}


