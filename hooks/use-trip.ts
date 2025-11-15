"use client";

import { useState, useEffect } from "react";
import { TripItem } from "@/types";

const TRIP_STORAGE_KEY = "travelers-trip";

export function useTrip() {
  const [tripItems, setTripItems] = useState<TripItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(TRIP_STORAGE_KEY);
    if (stored) {
      setTripItems(JSON.parse(stored));
    }
  }, []);

  const addToTrip = (item: TripItem) => {
    const updated = [...tripItems, item];
    setTripItems(updated);
    localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(updated));
  };

  const removeFromTrip = (id: string) => {
    const updated = tripItems.filter((item) => item.id !== id);
    setTripItems(updated);
    localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(updated));
  };

  const clearTrip = () => {
    setTripItems([]);
    localStorage.removeItem(TRIP_STORAGE_KEY);
  };

  const totalPrice = tripItems.reduce((sum, item) => sum + item.price, 0);

  return {
    tripItems,
    addToTrip,
    removeFromTrip,
    clearTrip,
    totalPrice,
  };
}


