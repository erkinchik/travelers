"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  ShoppingCart,
  Heart,
  Wifi,
  UtensilsCrossed,
  Users,
  Camera,
  MessageSquare,
  X,
  Mail,
  Phone,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Carousel } from "@/components/ui/carousel";
import {
  getItemById,
  getSimilarItems,
  getNearbyItems,
} from "@/lib/data";
import { useTrip } from "@/hooks/use-trip";
import Image from "next/image";
import { Item, Tour } from "@/types";
import dynamic from "next/dynamic";

const MapboxMap = dynamic(() => import("@/components/map"), { ssr: false });

export default function DetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToTrip } = useTrip();
  const item = getItemById(params.id as string);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  useEffect(() => {
    // Auto-advance images every 5 seconds
    if (item && item.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [item]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sand-50 to-blue-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Item not found</h1>
          <Button onClick={() => router.push("/explore")}>
            Back to Explore
          </Button>
        </div>
      </div>
    );
  }

  const isTour = item.type === "tour";
  const tour = isTour ? (item as Tour) : null;
  const similarItems = getSimilarItems(item.id, 4);
  const nearbyItems = getNearbyItems(item.id, 100, 4);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + item.images.length) % item.images.length
    );
  };

  const handleAddToTrip = () => {
    addToTrip({
      id: item.id,
      type: item.type,
      name: item.name,
      price: item.price,
      currency: item.currency,
    });
    router.push("/trip");
  };

  const handleBookNow = () => {
    router.push(`/booking?item=${item.id}`);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes("wifi")) return Wifi;
    if (feature.toLowerCase().includes("meal") || feature.toLowerCase().includes("food")) return UtensilsCrossed;
    if (feature.toLowerCase().includes("guide")) return Users;
    return Check;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-50 to-blue-50">
      {/* Hero Section with Parallax */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={item.images[currentImageIndex]}
            alt={item.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </motion.div>

        {/* Navigation */}
        <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            ← Back
          </Button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSaved(!isSaved)}
            className={`p-3 rounded-full backdrop-blur-sm shadow-lg transition-all ${
              isSaved
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-700 hover:bg-white"
            }`}
          >
            <Heart
              className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`}
            />
          </motion.button>
        </div>

        {/* Image Navigation */}
        {item.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-lg transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-lg transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {item.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "bg-white w-8"
                      : "bg-white/50 w-2"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 container mx-auto px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              {item.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white mb-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">{item.location}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{item.rating}</span>
                <span className="text-sm">({item.reviewCount} reviews)</span>
              </div>
              {isTour && tour && (
                <div className="bg-blue-500/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                  Organized by {tour.organizer}
                </div>
              )}
            </div>
            <p className="text-xl text-white/90 drop-shadow-lg max-w-2xl">
              {item.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky Booking Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b shadow-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-3xl font-bold text-gray-900">
                  {item.price === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    <>
                      ${item.price}
                      <span className="text-lg text-gray-600 ml-2">
                        {item.currency}
                      </span>
                    </>
                  )}
                </p>
              </div>
              {isTour && tour && (
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {tour.duration}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleAddToTrip}
                className="rounded-xl"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add to Trip
              </Button>
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Button
                  size="lg"
                  onClick={handleBookNow}
                  className="rounded-xl px-8"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Book Now
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-12">
        {/* Key Info Cards */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isTour && tour
              ? tour.includes.map((include, idx) => {
                  const Icon = getFeatureIcon(include);
                  return (
                    <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">{include}</p>
                      </CardContent>
                    </Card>
                  );
                })
              : item.type === "hostel" &&
                "amenities" in item &&
                item.amenities.slice(0, 4).map((amenity, idx) => {
                  const Icon = getFeatureIcon(amenity);
                  return (
                    <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">{amenity}</p>
                      </CardContent>
                    </Card>
                  );
                })}
          </div>
        </motion.section>

        {/* Tabs Section */}
        <Tabs defaultValue="about" className="mb-12">
          <TabsList className="mb-6 bg-white rounded-xl p-1">
            <TabsTrigger value="about" className="rounded-lg">
              About
            </TabsTrigger>
            <TabsTrigger value="photos" className="rounded-lg">
              <Camera className="h-4 w-4 mr-2" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-lg">
              <MessageSquare className="h-4 w-4 mr-2" />
              Reviews ({item.reviewCount})
            </TabsTrigger>
            <TabsTrigger value="location" className="rounded-lg">
              <MapPin className="h-4 w-4 mr-2" />
              Location
            </TabsTrigger>
            {nearbyItems.length > 0 && (
              <TabsTrigger value="nearby" className="rounded-lg">
                Nearby Experiences
              </TabsTrigger>
            )}
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">About</h3>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {item.description}
                  </p>
                  {isTour && tour && (
                    <div className="mb-6">
                      <h4 className="text-xl font-semibold mb-3">What's Included</h4>
                      <ul className="space-y-2">
                        {tour.includes.map((include, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            <span>{include}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.type === "hostel" && "amenities" in item && (
                    <div>
                      <h4 className="text-xl font-semibold mb-3">Amenities</h4>
                      <div className="flex flex-wrap gap-3">
                        {item.amenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {isTour && tour && (
                  <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                    <h4 className="font-semibold mb-2">Organized by {tour.organizer}</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Get in touch with the organizer for more information
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6">Photo Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {item.images.map((image, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="relative h-48 rounded-xl overflow-hidden cursor-pointer group"
                      onClick={() => openLightbox(idx)}
                    >
                      <Image
                        src={image}
                        alt={`${item.name} ${idx + 1}`}
                        fill
                        className="object-cover group-hover:brightness-110 transition-all"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Reviews</h3>
                    <div className="flex items-center gap-2">
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold">{item.rating}</span>
                      <span className="text-gray-600">
                        ({item.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Review
                  </Button>
                </div>

                <AnimatePresence>
                  {showReviewForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-6 bg-gray-50 rounded-xl"
                    >
                      <h4 className="font-semibold mb-4">Write a Review</h4>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setReviewRating(rating)}
                              className={`p-2 rounded ${
                                rating <= reviewRating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  rating <= reviewRating ? "fill-current" : ""
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience..."
                        className="w-full p-3 border rounded-lg mb-4 min-h-[100px]"
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            setShowReviewForm(false);
                            setReviewText("");
                          }}
                        >
                          Submit Review
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowReviewForm(false);
                            setReviewText("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-6">
                  {item.reviews && item.reviews.length > 0 ? (
                    item.reviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-b pb-6 last:border-0"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                              {review.author[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-lg">
                                {review.author}
                              </p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No reviews yet. Be the first to share your experience!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4">Location</h3>
                <p className="text-gray-700 mb-6">{item.location}</p>
                <div className="h-[400px] rounded-xl overflow-hidden bg-gray-200">
                  <MapboxMap items={[item]} selectedItem={item} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nearby Experiences Tab */}
          {nearbyItems.length > 0 && (
            <TabsContent value="nearby">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-6">Nearby Experiences</h3>
                  <Carousel>
                    {nearbyItems.map((nearbyItem) => (
                      <div
                        key={nearbyItem.id}
                        className="flex-shrink-0 w-[300px]"
                      >
                        <Card
                          className="overflow-hidden cursor-pointer h-full hover:shadow-xl transition-all"
                          onClick={() => router.push(`/details/${nearbyItem.id}`)}
                        >
                          <div className="relative h-40 w-full">
                            <Image
                              src={nearbyItem.images[0]}
                              alt={nearbyItem.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2 line-clamp-1">
                              {nearbyItem.name}
                            </h4>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">
                                  {nearbyItem.rating}
                                </span>
                              </div>
                              <span className="text-sm font-bold">
                                {nearbyItem.price === 0
                                  ? "Free"
                                  : `$${nearbyItem.price}`}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </Carousel>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Similar Places Section */}
        {similarItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Similar Places You May Like</h2>
              <Button
                variant="outline"
                onClick={() => router.push(`/explore?type=${item.type}`)}
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <Carousel>
              {similarItems.map((similarItem) => (
                <div key={similarItem.id} className="flex-shrink-0 w-[350px]">
                  <Card
                    className="overflow-hidden cursor-pointer h-full hover:shadow-xl transition-all"
                    onClick={() => router.push(`/details/${similarItem.id}`)}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={similarItem.images[0]}
                        alt={similarItem.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">
                        {similarItem.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {similarItem.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">
                            {similarItem.rating}
                          </span>
                        </div>
                        <span className="text-lg font-bold">
                          {similarItem.price === 0
                            ? "Free"
                            : `$${similarItem.price}`}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </Carousel>
          </motion.section>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-6xl p-0 bg-black/95 border-0">
          <div className="relative h-[80vh]">
            <Image
              src={item.images[lightboxIndex]}
              alt={`${item.name} ${lightboxIndex + 1}`}
              fill
              className="object-contain"
            />
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2"
            >
              <X className="h-6 w-6" />
            </button>
            {item.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setLightboxIndex(
                      (lightboxIndex - 1 + item.images.length) %
                        item.images.length
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full p-3"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() =>
                    setLightboxIndex((lightboxIndex + 1) % item.images.length)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full p-3"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
