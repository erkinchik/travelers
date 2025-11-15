import { Destination, Hostel, Tour, Place, Item } from "@/types";
import destinationsData from "@/data/destinations.json";
import hostelsData from "@/data/hostels.json";
import toursData from "@/data/tours.json";
import placesData from "@/data/places.json";
import testimonialsData from "@/data/testimonials.json";

export const destinations: Destination[] = destinationsData as Destination[];
export const hostels: Hostel[] = hostelsData as Hostel[];
export const tours: Tour[] = toursData as Tour[];
export const places: Place[] = placesData as Place[];

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
  tripType: string;
}

export const testimonials: Testimonial[] = testimonialsData as Testimonial[];

export const allItems: Item[] = [
  ...hostels,
  ...tours,
  ...places,
];

export function getItemById(id: string): Item | undefined {
  return allItems.find((item) => item.id === id);
}

export function getItemsByType(type: "hostel" | "tour" | "place"): Item[] {
  return allItems.filter((item) => item.type === type);
}

export function getItemsByRegion(region: string): Item[] {
  return allItems.filter((item) => item.region === region);
}

export function searchItems(query: string): Item[] {
  const lowerQuery = query.toLowerCase();
  return allItems.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.location.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
  );
}

export function searchDestinations(query: string): Destination[] {
  const lowerQuery = query.toLowerCase();
  return destinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(lowerQuery) ||
      dest.description.toLowerCase().includes(lowerQuery) ||
      dest.region.toLowerCase().includes(lowerQuery)
  );
}

export function getSimilarItems(itemId: string, limit: number = 4): Item[] {
  const item = getItemById(itemId);
  if (!item) return [];

  return allItems
    .filter((i) => i.id !== itemId && i.type === item.type)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function getNearbyItems(
  itemId: string,
  radius: number = 50,
  limit: number = 4
): Item[] {
  const item = getItemById(itemId);
  if (!item) return [];

  // Simple distance calculation (Haversine formula would be more accurate)
  const calculateDistance = (
    coord1: [number, number],
    coord2: [number, number]
  ): number => {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return allItems
    .filter((i) => {
      if (i.id === itemId) return false;
      const distance = calculateDistance(item.coordinates, i.coordinates);
      return distance <= radius;
    })
    .sort((a, b) => {
      const distA = calculateDistance(item.coordinates, a.coordinates);
      const distB = calculateDistance(item.coordinates, b.coordinates);
      return distA - distB;
    })
    .slice(0, limit);
}

