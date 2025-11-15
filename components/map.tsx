"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Item } from "@/types";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface MapboxMapProps {
  items: Item[];
  selectedItem: Item | null;
}

export default function MapboxMap({ items, selectedItem }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    // Check if we have a valid token
    if (!token || token.includes("your_mapbox_token") || token.length < 20) {
      setMapError("Mapbox token not configured");
      return;
    }

    // Initialize map
    mapboxgl.accessToken = token;

    try {
      if (!map.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/light-v11",
          center: [74.6, 42.9], // Bishkek
          zoom: 6,
        });

        map.current.on("error", (e: any) => {
          console.error("Mapbox error:", e);
          setMapError("Map failed to load. Please check your Mapbox token.");
        });
      }
    } catch (error) {
      console.error("Map initialization error:", error);
      setMapError("Failed to initialize map");
      return;
    }

    if (!map.current) return;

    // Wait for map to load before adding markers
    const addMarkers = () => {
      if (!map.current) return;

      // Clean up markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Add markers for each item
      items.forEach((item) => {
        const el = document.createElement("div");
        el.className = "custom-marker";
        el.style.width = "32px";
        el.style.height = "32px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor =
          item.type === "hostel"
            ? "#3b82f6"
            : item.type === "tour"
            ? "#10b981"
            : "#f59e0b";
        el.style.border = "3px solid white";
        el.style.cursor = "pointer";
        el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

        if (selectedItem?.id === item.id) {
          el.style.width = "40px";
          el.style.height = "40px";
          el.style.borderWidth = "4px";
        }

        const marker = new mapboxgl.Marker(el)
          .setLngLat(item.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div class="p-2">
              <h3 class="font-semibold">${item.name}</h3>
              <p class="text-sm text-gray-600">${item.location}</p>
              <p class="text-sm font-semibold mt-1">
                ${item.price === 0 ? "Free" : `$${item.price}`}
              </p>
            </div>`
            )
          )
          .addTo(map.current);

        markersRef.current.push(marker);
      });

      // Fit bounds to show all markers or center on single item
      if (items.length > 0) {
        if (items.length === 1) {
          // Center on single item
          map.current.setCenter(items[0].coordinates);
          map.current.setZoom(12);
        } else {
          // Fit bounds for multiple items
          const bounds = new mapboxgl.LngLatBounds();
          items.forEach((item) => {
            bounds.extend(item.coordinates);
          });
          map.current.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            maxZoom: 10,
          });
        }
      }
    };

    if (map.current.loaded()) {
      addMarkers();
    } else {
      map.current.on("load", addMarkers);
    }
  }, [items, selectedItem]);

  if (mapError) {
    return (
      <div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
        <Card className="p-6 max-w-md mx-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Map Unavailable</h3>
            <p className="text-sm text-gray-600 mb-4">
              {mapError === "Mapbox token not configured"
                ? "To enable the map, add your Mapbox token to .env.local:"
                : mapError}
            </p>
            {mapError === "Mapbox token not configured" && (
              <div className="bg-gray-50 p-3 rounded-lg text-left mb-4">
                <code className="text-xs">
                  NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
                </code>
              </div>
            )}
            <p className="text-xs text-gray-500">
              Get a free token at{" "}
              <a
                href="https://www.mapbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
        </Card>
        <div className="absolute top-4 left-4 z-10">
          <Card className="p-3 bg-white/95 backdrop-blur-sm">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Hostels</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Tours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>Places</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-4 left-4 z-10">
        <Card className="p-3 bg-white/95 backdrop-blur-sm">
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Hostels</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Tours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>Places</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

