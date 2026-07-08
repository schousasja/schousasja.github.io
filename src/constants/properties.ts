export interface Property {
  id: string;
  name: string;
  location: string;
  country: 'UAE' | 'India' | 'Southeast Asia';
  image: string;
  expectedYield: string;
  startingPrice: string;
  developer: {
    name: string;
    credibility: string;
    rating: number;
  };
  highlights: string[];
  status: 'Available' | 'Sold Out' | 'Launching Soon';
}

export const properties: Property[] = [
  {
    id: 'prop-1',
    name: 'The Opus Tower',
    location: 'Business Bay, Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1582656622383-35d20739ba64?auto=format&fit=crop&q=80&w=2070',
    expectedYield: '7.8%',
    startingPrice: 'AED 2,450,000',
    developer: {
      name: 'Omniyat',
      credibility: 'Award-winning developer known for architectural masterpieces.',
      rating: 4.9
    },
    highlights: ['Prime Business Hub', 'Zaha Hadid Design', 'High Capital Appreciation'],
    status: 'Available'
  },
  {
    id: 'prop-2',
    name: 'Emaar Beachfront',
    location: 'Dubai Marina',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1541339902294-12e006a13344?auto=format&fit=crop&q=80&w=2069',
    expectedYield: '6.5%',
    startingPrice: 'AED 3,100,000',
    developer: {
      name: 'Emaar Properties',
      credibility: 'Largest developer in the region, builder of Burj Khalifa.',
      rating: 5.0
    },
    highlights: ['Private Beach Access', 'Miami-style Living', 'Premium ROI'],
    status: 'Available'
  },
  {
    id: 'prop-3',
    name: 'Lodha World One',
    location: 'Lower Parel, Mumbai',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1623659103911-3047036cd7b9?auto=format&fit=crop&q=80&w=2043',
    expectedYield: '4.2%',
    startingPrice: 'INR 125,000,000',
    developer: {
      name: 'Lodha Group',
      credibility: 'India\'s largest real estate developer by sales.',
      rating: 4.5
    },
    highlights: ['Tallest Residential Tower', 'Designer Interiors', 'Central Business Core'],
    status: 'Available'
  },
  {
    id: 'prop-4',
    name: 'Prestige Golfshire',
    location: 'Devalahalli, Bangalore',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2070',
    expectedYield: '5.1%',
    startingPrice: 'INR 85,000,000',
    developer: {
      name: 'Prestige Group',
      credibility: 'Tier-1 developer with 30+ years of excellence.',
      rating: 4.7
    },
    highlights: ['Luxury Golf Living', 'Near Tech Corridors', 'Bespoke Amenities'],
    status: 'Available'
  },
  {
    id: 'prop-5',
    name: 'The Ritz-Carlton Residences',
    location: 'KLCC, Kuala Lumpur',
    country: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1582656622383-35d20739ba64?auto=format&fit=crop&q=80&w=2070',
    expectedYield: '5.8%',
    startingPrice: 'MYR 4,800,000',
    developer: {
      name: 'Berjaya Corp',
      credibility: 'Conglomerate with massive global portfolio.',
      rating: 4.6
    },
    highlights: ['Gloabl Brand Equity', 'Golden Triangle Location', 'Hospitality Standard'],
    status: 'Available'
  },
  {
    id: 'prop-6',
    name: 'District 2 Luxury Suites',
    location: 'Thao Dien, Ho Chi Minh City',
    country: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=2070',
    expectedYield: '8.2%',
    startingPrice: 'USD 450,000',
    developer: {
      name: 'SonKim Land',
      credibility: 'Leader in boutique luxury developments in Vietnam.',
      rating: 4.8
    },
    highlights: ['Emerging Market Growth', 'Expat Hub', 'Under-supplied Luxury'],
    status: 'Available'
  },
  {
    id: 'prop-7',
    name: 'Park Nova',
    location: 'Orchard Road, Singapore',
    country: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1525596662741-e94ff9926de3?auto=format&fit=crop&q=80&w=2070',
    expectedYield: '3.2%',
    startingPrice: 'SGD 6,500,000',
    developer: {
      name: 'Shun Tak Holdings',
      credibility: 'Premier developer specializing in ultra-luxury urban living.',
      rating: 4.9
    },
    highlights: ['Ultra-Luxury Garden Living', 'Prime Orchard Address', 'Institutional Safety'],
    status: 'Available'
  },
  {
    id: 'prop-8',
    name: 'Alila Villas',
    location: 'Uluwatu, Bali',
    country: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2070',
    expectedYield: '12.5%',
    startingPrice: 'USD 1,200,000',
    developer: {
      name: 'PT Bukit Uluwatu',
      credibility: 'Leader in eco-luxury hospitality developments in Indonesia.',
      rating: 4.7
    },
    highlights: ['Iconic Hospitality Asset', 'High Rental Demand', 'Eco-Luxury Design'],
    status: 'Available'
  },
  {
    id: 'prop-9',
    name: 'Aman Residences',
    location: 'Nai Lert, Bangkok',
    country: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579367?auto=format&fit=crop&q=80&w=2070',
    expectedYield: '5.5%',
    startingPrice: 'USD 2,800,000',
    developer: {
      name: 'Nai Lert Park Development',
      credibility: 'Strategic heritage developer with a focus on high-end luxury.',
      rating: 4.8
    },
    highlights: ['Global Brand Prestige', 'Rare Heritage Site', 'Medical Hub Access'],
    status: 'Available'
  },
  {
    id: 'prop-10',
    name: 'The Sapphire Residences',
    location: 'Galle Face, Colombo',
    country: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1586611292717-f828b167408c?auto=format&fit=crop&q=80&w=2070',
    expectedYield: '9.0%',
    startingPrice: 'USD 750,000',
    developer: {
      name: 'ITC Hotels',
      credibility: 'Global hospitality leader with a strong Asian footprint.',
      rating: 4.6
    },
    highlights: ['Landmark Maritime Hub', 'Sky-high Amenities', 'Strategic Port City Adjacent'],
    status: 'Available'
  }
];
