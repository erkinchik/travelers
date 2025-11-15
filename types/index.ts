export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  region: string;
  coordinates: [number, number];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Hostel {
  id: string;
  name: string;
  description: string;
  type: "hostel";
  images: string[];
  location: string;
  coordinates: [number, number];
  region: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
  reviews: Review[];
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  type: "tour";
  images: string[];
  location: string;
  coordinates: [number, number];
  region: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  duration: string;
  organizer: string;
  includes: string[];
  reviews: Review[];
}

export interface Place {
  id: string;
  name: string;
  description: string;
  type: "place";
  images: string[];
  location: string;
  coordinates: [number, number];
  region: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  category: string;
  reviews: Review[];
}

export type Item = Hostel | Tour | Place;

export interface TripItem {
  id: string;
  type: "hostel" | "tour" | "place";
  name: string;
  price: number;
  currency: string;
  date?: string;
}

