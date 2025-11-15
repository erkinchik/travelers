"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Star, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allItems, getItemsByType, getItemsByRegion, searchItems } from "@/lib/data";
import { Item } from "@/types";
import dynamic from "next/dynamic";
import Image from "next/image";

const MapboxMap = dynamic(() => import("@/components/map"), { ssr: false });

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Item[]>(allItems);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "all",
    region: searchParams.get("region") || "all",
    budget: searchParams.get("budget") || "all",
    rating: searchParams.get("rating") || "all",
  });
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    let filtered = allItems;

    // Search filter
    if (searchQuery) {
      filtered = searchItems(searchQuery);
    }

    // Type filter
    if (filters.type !== "all") {
      filtered = filtered.filter((item) => item.type === filters.type);
    }

    // Region filter
    if (filters.region !== "all") {
      filtered = filtered.filter((item) => item.region === filters.region);
    }

    // Budget filter
    if (filters.budget !== "all") {
      const [min, max] = filters.budget.split("-").map(Number);
      filtered = filtered.filter((item) => {
        if (item.price === 0) return filters.budget === "free";
        if (filters.budget === "free") return false;
        if (filters.budget === "100+") return item.price >= 100;
        return item.price >= min && item.price <= max;
      });
    }

    // Rating filter
    if (filters.rating !== "all") {
      const minRating = Number(filters.rating);
      filtered = filtered.filter((item) => item.rating >= minRating);
    }

    setItems(filtered);
  }, [filters, searchQuery]);

  const regions = Array.from(new Set(allItems.map((item) => item.region)));

  const handleViewDetails = (item: Item) => {
    router.push(`/details/${item.id}`);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header with Filters */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="font-semibold">Filters:</span>
            </div>

            <Select
              value={filters.type}
              onValueChange={(value) =>
                setFilters({ ...filters, type: value })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hostel">Hostels</SelectItem>
                <SelectItem value="tour">Tours</SelectItem>
                <SelectItem value="place">Places</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.region}
              onValueChange={(value) =>
                setFilters({ ...filters, region: value })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.budget}
              onValueChange={(value) =>
                setFilters({ ...filters, budget: value })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="0-25">$0 - $25</SelectItem>
                <SelectItem value="25-50">$25 - $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100+">$100+</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.rating}
              onValueChange={(value) =>
                setFilters({ ...filters, rating: value })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                <SelectItem value="4.0">4.0+ Stars</SelectItem>
                <SelectItem value="3.5">3.5+ Stars</SelectItem>
              </SelectContent>
            </Select>

            {(filters.type !== "all" ||
              filters.region !== "all" ||
              filters.budget !== "all" ||
              filters.rating !== "all" ||
              searchQuery) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters({
                    type: "all",
                    region: "all",
                    budget: "all",
                    rating: "all",
                  });
                  setSearchQuery("");
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}

            <div className="ml-auto">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Split View: List + Map */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: List */}
        <div className="w-1/2 overflow-y-auto bg-gray-50 p-6">
          <h2 className="text-2xl font-bold mb-4">
            {items.length} {items.length === 1 ? "result" : "results"}
          </h2>
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedItem(item)}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedItem?.id === item.id
                      ? "ring-2 ring-primary shadow-lg"
                      : "hover:shadow-md"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <MapPin className="h-4 w-4" />
                              <span>{item.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">
                                {item.rating}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.price === 0 ? (
                                <span className="text-green-600 font-semibold">
                                  Free
                                </span>
                              ) : (
                                <span>
                                  ${item.price}{" "}
                                  <span className="text-xs">{item.currency}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {item.description}
                        </p>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(item);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          {items.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No results found. Try adjusting your filters.
            </div>
          )}
        </div>

        {/* Right: Map */}
        <div className="w-1/2 relative">
          <MapboxMap items={items} selectedItem={selectedItem} />
        </div>
      </div>
    </div>
  );
}


