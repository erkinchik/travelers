"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2, Plus, ShoppingCart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTrip } from "@/hooks/use-trip";
import { getItemById } from "@/lib/data";

export default function TripPlannerPage() {
  const router = useRouter();
  const { tripItems, removeFromTrip, clearTrip, totalPrice } = useTrip();

  const handleBookAll = () => {
    router.push("/booking");
  };

  if (tripItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold mb-4">Your Trip Planner</h1>
          <p className="text-gray-600 mb-6">
            Start building your itinerary by adding hostels, tours, and places
            from the explore page.
          </p>
          <Button onClick={() => router.push("/explore")} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Explore & Add Items
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Trip Planner</h1>
            <p className="text-gray-600">
              {tripItems.length} {tripItems.length === 1 ? "item" : "items"} in
              your itinerary
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={clearTrip}>
              Clear All
            </Button>
            <Button onClick={() => router.push("/explore")}>
              <Plus className="mr-2 h-4 w-4" />
              Add More
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {tripItems.map((tripItem, idx) => {
                const item = getItemById(tripItem.id);
                return (
                  <motion.div
                    key={tripItem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold">
                                  {tripItem.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {item?.location || "Location"}
                                </p>
                                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 rounded text-xs">
                                  {tripItem.type}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold">
                                  {tripItem.price === 0 ? (
                                    <span className="text-green-600">Free</span>
                                  ) : (
                                    `$${tripItem.price}`
                                  )}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromTrip(tripItem.id)}
                              className="mt-3"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Trip Summary</h2>
                <div className="space-y-4 mb-6">
                  {tripItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-medium">
                        {item.price === 0 ? "Free" : `$${item.price}`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleBookAll}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Book All Together
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => router.push("/explore")}
                >
                  Continue Exploring
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


