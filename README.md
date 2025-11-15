# Travelers - Kyrgyzstan Travel Platform

A modern travel platform MVP for exploring Kyrgyzstan, combining features of Airbnb, Booking.com, and TripAdvisor. Built with Next.js, TypeScript, Tailwind CSS, and modern web technologies.

## Features

- 🏠 **Find Hostels** - Browse budget-friendly accommodations
- 🧭 **Choose Tours** - Discover guided experiences and adventures
- 🗺️ **Explore Places** - Find attractions and must-see destinations
- 📅 **Plan Your Trip** - Build a custom itinerary with timeline view
- 💳 **Booking System** - Book individual items or entire trips
- 🗺️ **Interactive Maps** - Mapbox integration for location visualization

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Data Fetching**: React Query (TanStack Query)
- **Maps**: Mapbox GL
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up Mapbox (optional, for map functionality):

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

You can get a free Mapbox token from [mapbox.com](https://www.mapbox.com/). The app will work without it, but map features will be limited.

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
travelers/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── explore/           # Explore page with map
│   ├── details/[id]/      # Detail page for items
│   ├── trip/              # Trip planner page
│   └── booking/           # Booking confirmation page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── map.tsx           # Mapbox map component
├── data/                  # Mock JSON data
│   ├── destinations.json
│   ├── hostels.json
│   ├── tours.json
│   └── places.json
├── hooks/                 # Custom React hooks
│   └── use-trip.ts       # Trip management hook
├── lib/                   # Utility functions
│   ├── data.ts           # Data fetching utilities
│   └── utils.ts          # General utilities
└── types/                 # TypeScript type definitions
```

## Pages

### Home Page (`/`)
- Search bar with destination autocomplete
- Quick category cards (Hostels, Tours, Places, Trip Planner)
- Popular destinations section
- "Open Map" button

### Explore Page (`/explore`)
- Split-screen view: list on left, map on right
- Filters: type, region, budget, rating
- Interactive Mapbox map with markers
- Click items to view details

### Detail Page (`/details/[id]`)
- Image carousel
- Item information and description
- Tabs: Overview, Location, Reviews
- "Add to Trip" and "Book Now" buttons
- Special display for tour organizers

### Trip Planner (`/trip`)
- Timeline view of added items
- Price summary
- Add/remove items
- "Book All Together" functionality

### Booking Page (`/booking`)
- Summary of items to book
- Price breakdown
- "Confirm & Pay" button (demo)
- Confirmation screen

## Data

The app uses mock JSON data located in the `/data` directory:
- `destinations.json` - Popular destinations
- `hostels.json` - Hostel listings
- `tours.json` - Tour packages
- `places.json` - Attractions and places

## Styling

The app uses a travel-inspired color palette:
- Sand tones for backgrounds
- Blue for primary actions
- Green for tours/nature
- Amber for places/attractions

All components use rounded corners (2xl), soft shadows, and airy spacing for a modern, clean look.

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Notes

- This is an MVP/demo application
- Payment processing is simulated (no actual payments)
- Mapbox token is optional but recommended for full map functionality
- All data is stored locally (localStorage for trip items)
- Images are loaded from Unsplash (external URLs)

## License

MIT


