"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Search,
  Map,
  Bed,
  Compass,
  Calendar,
  Mountain,
  Star,
  ArrowRight,
  Quote,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
import {
  destinations,
  tours,
  hostels,
  testimonials,
  searchDestinations,
} from "@/lib/data";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const results = searchDestinations(query);
      setSuggestions(results.map((d) => d.name));
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (destination?: string) => {
    const query = destination || searchQuery;
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (searchType !== "all") params.set("type", searchType);
    router.push(`/explore?${params.toString()}`);
  };

  const topHostels = [...hostels]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const recommendedTours = [...tours]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  // Hero Section
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
              alt="Kyrgyzstan Mountains"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
          </div>
        </div>

        <motion.div
          style={{ opacity }}
          className="relative z-10 container mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              Discover the Heart
              <br />
              of Central Asia
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow-lg">
              Where ancient nomadic traditions meet breathtaking mountain
              landscapes. Your adventure in Kyrgyzstan starts here.
            </p>

            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Where do you want to go?"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearchSubmit();
                      }
                    }}
                    className="pl-12 pr-4 py-6 text-lg rounded-xl"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200">
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchQuery(suggestion);
                            setSuggestions([]);
                            handleSearchSubmit(suggestion);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="w-full md:w-[180px] py-6 rounded-xl">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="hostel">Hostels</SelectItem>
                    <SelectItem value="tour">Tours</SelectItem>
                    <SelectItem value="place">Places</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => handleSearchSubmit()}
                  size="lg"
                  className="px-8 py-6 rounded-xl text-lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/explore")}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 rounded-xl px-8"
              >
                <Map className="mr-2 h-5 w-5" />
                Explore on Map
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/80"
          >
            <ChevronRight className="h-6 w-6 rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Access Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Start Your Journey
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to plan your perfect trip
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Bed,
                title: "Find a Hostel",
                description: "Budget-friendly stays",
                color: "bg-blue-100 text-blue-700",
                href: "/explore?type=hostel",
              },
              {
                icon: Compass,
                title: "Choose a Tour",
                description: "Guided experiences",
                color: "bg-green-100 text-green-700",
                href: "/explore?type=tour",
              },
              {
                icon: Mountain,
                title: "Explore Places",
                description: "Attractions & sights",
                color: "bg-amber-100 text-amber-700",
                href: "/explore?type=place",
              },
              {
                icon: Calendar,
                title: "Plan a Trip",
                description: "Build your itinerary",
                color: "bg-purple-100 text-purple-700",
                href: "/trip",
              },
            ].map((category, idx) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-xl transition-all h-full"
                    onClick={() => router.push(category.href)}
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`${category.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}
                      >
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600">
              Discover the most beautiful places in Kyrgyzstan
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, idx) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="group"
              >
                <Card
                  className="overflow-hidden cursor-pointer h-full hover:shadow-2xl transition-all"
                  onClick={() =>
                    router.push(`/explore?region=${destination.region}`)
                  }
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {destination.name}
                      </h3>
                      <p className="text-white/90 text-sm line-clamp-2">
                        {destination.description}
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {destination.region} Region
                      </span>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Tours Carousel */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Recommended Tours
              </h2>
              <p className="text-xl text-gray-600">
                Adventure awaits with our curated experiences
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/explore?type=tour")}
            >
              View All Tours
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <Carousel>
            {recommendedTours.map((tour, idx) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex-shrink-0 w-[350px]"
              >
                <Card
                  className="overflow-hidden cursor-pointer h-full hover:shadow-xl transition-all"
                  onClick={() => router.push(`/details/${tour.id}`)}
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={tour.images[0]}
                      alt={tour.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-green-600">
                        {tour.organizer}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">
                          {tour.rating}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{tour.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {tour.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">${tour.price}</p>
                        <p className="text-xs text-gray-500">
                          {tour.duration}
                        </p>
                      </div>
                      <Button size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* Top Hostels */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Top-Rated Hostels
              </h2>
              <p className="text-xl text-gray-600">
                Comfortable stays that won't break the bank
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/explore?type=hostel")}
            >
              View All Hostels
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topHostels.map((hostel, idx) => (
              <motion.div
                key={hostel.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card
                  className="overflow-hidden cursor-pointer h-full hover:shadow-xl transition-all"
                  onClick={() => router.push(`/details/${hostel.id}`)}
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={hostel.images[0]}
                      alt={hostel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{hostel.rating}</span>
                        <span className="text-sm text-gray-500">
                          ({hostel.reviewCount})
                        </span>
                      </div>
                      <span className="text-lg font-bold">${hostel.price}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{hostel.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {hostel.description}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {hostel.location}
                    </p>
                    <Button size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Kyrgyzstan Storytelling Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] rounded-2xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
                alt="Kyrgyzstan Landscape"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Travel to Kyrgyzstan?
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  Nestled in the heart of Central Asia, Kyrgyzstan is a land
                  where time seems to stand still. Here, ancient nomadic
                  traditions live on in the warm hospitality of local families,
                  who welcome travelers into their yurts with open arms and
                  steaming cups of tea.
                </p>
                <p>
                  From the crystal-clear waters of Issyk-Kul Lake to the
                  snow-capped peaks of the Tien Shan mountains, every corner of
                  this country tells a story. Ride horses across alpine meadows,
                  hike through pristine national parks, and fall asleep under
                  the Milky Way in a traditional yurt.
                </p>
                <p>
                  But what truly sets Kyrgyzstan apart is its people. Friendly,
                  curious, and proud of their heritage, locals are eager to
                  share their culture, stories, and home-cooked meals. This
                  isn't just a destination—it's an experience that will change
                  the way you see the world.
                </p>
              </div>
              <Button
                size="lg"
                className="mt-8 rounded-xl"
                onClick={() => router.push("/explore")}
              >
                Start Your Adventure
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Local Voices Testimonials */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Local Voices
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from travelers who discovered Kyrgyzstan
            </p>
          </motion.div>

          <Carousel>
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex-shrink-0 w-[400px]"
              >
                <Card className="h-full p-8 hover:shadow-xl transition-all">
                  <Quote className="h-10 w-10 text-primary/20 mb-4" />
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.tripType} from {testimonial.location}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Find Your Next Adventure
              <br />
              in Kyrgyzstan
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start planning your journey today. Discover hostels, book tours,
              and create memories that will last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-xl px-8 py-6 text-lg"
                onClick={() => router.push("/explore")}
              >
                Explore Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-8 py-6 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                onClick={() => router.push("/trip")}
              >
                Plan Your Trip
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
